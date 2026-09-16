import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User, generate_uuid
from app.models.verification import EmailVerification
from app.services.email import send_verification_passcode_email
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    CheckEmailRequest,
    CheckEmailResponse,
    SelectRoleRequest,
    VerifyEmailRequest,
    SendPasscodeRequest,
    VerifyPasscodeRequest,
    PasscodeResponse,
    RegisterResponse,
)
from app.schemas.user import UserRead, AuthResponse, OnboardingStepRequest
from app.api.deps import get_current_user

router = APIRouter()


def resolve_route(user: User, return_to: Optional[str] = None) -> str:
    """Matches frontend route resolution logic."""
    if user.account_status != "active":
        return "/"
    if not user.email_verified:
        return "/verify-email"
    if not user.role:
        return "/onboarding/select-role"

    if user.role == "student":
        if user.onboarding_status != "completed":
            return "/student/onboarding"
        return return_to or "/student/dashboard"

    if user.role == "advisor":
        if user.onboarding_status not in ["completed", "submitted"]:
            return "/advisor/onboarding"
        return return_to or "/advisor/dashboard"

    if user.role == "admin":
        return "/admin"

    return "/"


def _create_and_send_passcode(
    email: str, full_name: str, db: Session, purpose: str = "registration"
) -> str:
    """Invalidates older active passcodes, generates a 6-digit numeric OTP, stores it in DB, and dispatches via Resend."""
    email_clean = email.strip().lower()

    # Invalidate existing active verification records for this email
    db.query(EmailVerification).filter(
        EmailVerification.email == email_clean,
        EmailVerification.purpose == purpose,
        EmailVerification.is_used == False,
    ).update({"is_used": True})

    # Generate cryptographically strong 6-digit numeric passcode
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    verification = EmailVerification(
        email=email_clean,
        code=code,
        purpose=purpose,
        expires_at=expires_at,
        attempts=0,
        max_attempts=5,
        is_used=False,
    )
    db.add(verification)
    db.commit()

    # Dispatch email through Resend
    send_verification_passcode_email(
        email=email_clean,
        passcode=code,
        full_name=full_name or "Student",
    )

    return code


@router.post("/check-email", response_model=CheckEmailResponse, tags=["Auth"])
def check_email(payload: CheckEmailRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    return CheckEmailResponse(
        exists=bool(user),
        verified=user.email_verified if user else False,
    )


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED, tags=["Auth"])
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Stage 1 of registration: creates unverified user and dispatches 6-digit Resend email passcode."""
    email_clean = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()

    if existing and existing.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in.",
        )

    user_role = payload.role or "student"
    initial_status = "profile" if user_role == "student" else "personal"

    if existing and not existing.email_verified:
        # Re-use existing unverified profile
        existing.full_name = payload.full_name.strip()
        existing.password_hash = get_password_hash(payload.password)
        existing.role = user_role
        existing.onboarding_status = initial_status
        existing.current_step = initial_status
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        target_user = existing
    else:
        user_id = generate_uuid()
        new_user = User(
            id=user_id,
            auth_user_id=f"auth-{user_id}",
            full_name=payload.full_name.strip(),
            email=email_clean,
            password_hash=get_password_hash(payload.password),
            auth_provider="email",
            email_verified=False,  # Requires passcode verification
            role=user_role,
            onboarding_status=initial_status,
            current_step=initial_status,
            account_status="active",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        target_user = new_user

    # Generate and send passcode via Resend
    _create_and_send_passcode(
        email=email_clean,
        full_name=target_user.full_name,
        db=db,
        purpose="registration",
    )

    return RegisterResponse(
        success=True,
        requires_verification=True,
        email=email_clean,
        message="Verification passcode sent to your email. Please enter the 6-digit code to continue.",
        target="/verify-email",
    )


@router.post("/send-passcode", response_model=PasscodeResponse, tags=["Auth"])
def send_passcode(payload: SendPasscodeRequest, db: Session = Depends(get_db)):
    """Request a fresh 6-digit verification passcode for an email address."""
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    full_name = user.full_name if user else "Student"

    # Cooldown check: prevent requesting more than once every 20 seconds
    recent = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.email == email_clean,
            EmailVerification.purpose == payload.purpose,
            EmailVerification.created_at >= datetime.now(timezone.utc) - timedelta(seconds=20),
        )
        .first()
    )
    if recent:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Please wait a few moments before requesting another passcode.",
        )

    _create_and_send_passcode(
        email=email_clean,
        full_name=full_name,
        db=db,
        purpose=payload.purpose,
    )

    return PasscodeResponse(
        success=True,
        message=f"Passcode successfully sent to {email_clean}",
        email=email_clean,
        expires_in_seconds=600,
    )


@router.post("/verify-passcode", response_model=AuthResponse, tags=["Auth"])
def verify_passcode(payload: VerifyPasscodeRequest, db: Session = Depends(get_db)):
    """Validates submitted passcode, activates account, and issues authentication session."""
    email_clean = payload.email.strip().lower()
    submitted_code = payload.code.strip()

    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.email == email_clean,
            EmailVerification.is_used == False,
        )
        .order_by(EmailVerification.created_at.desc())
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active passcode found for this email. Please request a new code.",
        )

    now = datetime.now(timezone.utc)
    expiry = verification.expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if now > expiry:
        verification.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passcode has expired. Please click resend to get a new code.",
        )

    if verification.attempts >= verification.max_attempts:
        verification.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many incorrect attempts. Please request a new passcode.",
        )

    if verification.code.strip() != submitted_code:
        verification.attempts += 1
        db.commit()
        remaining = max(0, verification.max_attempts - verification.attempts)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect passcode. {remaining} attempt(s) remaining.",
        )

    # Passcode is valid! Mark verified
    verification.is_used = True

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )

    user.email_verified = True
    if user.role == "student" and user.onboarding_status in ("email_verification", "role_selection", None):
        user.onboarding_status = "profile"
        user.current_step = "profile"
    user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    token = create_access_token(
        subject=user.id,
        extra_claims={"role": user.role, "email": user.email},
    )
    target = resolve_route(user)

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.post("/login", response_model=AuthResponse, tags=["Auth"])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    # Strict authentication: verify user existence and bcrypt password hash
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.account_status}. Please contact support.",
        )

    token = create_access_token(
        subject=user.id,
        extra_claims={"role": user.role, "email": user.email},
    )
    target = resolve_route(user, payload.return_to)

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.get("/me", response_model=UserRead, tags=["Auth"])
def get_me(current_user: User = Depends(get_current_user)):
    return UserRead.model_validate(current_user)


@router.post("/verify-email", tags=["Auth"])
def verify_email(
    payload: Optional[VerifyEmailRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.email_verified = True
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return {"success": True, "message": "Email verified successfully."}


@router.post("/select-role", response_model=AuthResponse, tags=["Auth"])
def select_role(
    payload: SelectRoleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    initial_status = "profile" if payload.role == "student" else "personal"
    current_user.role = payload.role
    current_user.onboarding_status = initial_status
    current_user.current_step = initial_status
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)

    target = "/student/onboarding" if payload.role == "student" else "/advisor/onboarding"
    token = create_access_token(subject=current_user.id, extra_claims={"role": current_user.role, "email": current_user.email})

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(current_user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.put("/onboarding", response_model=AuthResponse, tags=["Auth"])
def save_onboarding_step(
    payload: OnboardingStepRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Apply step data to fields if provided
    for key, value in payload.step_data.items():
        if hasattr(current_user, key):
            setattr(current_user, key, value)

    next_status = (
        ("submitted" if current_user.role == "advisor" else "completed")
        if payload.is_last_step
        else payload.step_name
    )

    current_user.onboarding_status = next_status
    current_user.current_step = payload.step_name
    if payload.is_last_step and current_user.role == "advisor":
        current_user.advisor_verification_status = "pending"

    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)

    target = resolve_route(current_user)
    token = create_access_token(subject=current_user.id, extra_claims={"role": current_user.role, "email": current_user.email})

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(current_user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.post("/logout", tags=["Auth"])
def logout():
    return {"success": True, "message": "Successfully logged out."}
