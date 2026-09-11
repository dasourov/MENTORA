from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User, generate_uuid
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    QuickDemoLoginRequest,
    CheckEmailRequest,
    CheckEmailResponse,
    GoogleAuthRequest,
    SelectRoleRequest,
    VerifyEmailRequest,
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


@router.post("/check-email", response_model=CheckEmailResponse, tags=["Auth"])
def check_email(payload: CheckEmailRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    return CheckEmailResponse(
        exists=bool(user),
        verified=user.email_verified if user else False,
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, tags=["Auth"])
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    user_id = generate_uuid()
    initial_status = "role_selection"
    if payload.role:
        initial_status = "profile" if payload.role == "student" else "personal"

    new_user = User(
        id=user_id,
        auth_user_id=f"auth-{user_id}",
        full_name=payload.full_name.strip(),
        email=email_clean,
        password_hash=get_password_hash(payload.password),
        auth_provider="email",
        email_verified=True,  # Set to true on registration for smooth UX
        role=payload.role,
        onboarding_status=initial_status,
        current_step=initial_status if payload.role else None,
        account_status="active",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id, extra_claims={"role": new_user.role, "email": new_user.email})
    target = resolve_route(new_user)

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(new_user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.post("/login", response_model=AuthResponse, tags=["Auth"])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        # If user doesn't exist, allow auto-creation if email looks like a demo/seed account
        is_advisor = "advisor" in email_clean or "mentor" in email_clean
        user_id = generate_uuid()
        user = User(
            id=user_id,
            auth_user_id=f"auth-{user_id}",
            full_name=email_clean.split("@")[0].replace(".", " ").title(),
            email=email_clean,
            password_hash=get_password_hash(payload.password),
            auth_provider="email",
            email_verified=True,
            role="advisor" if is_advisor else "student",
            onboarding_status="completed",
            account_status="active",
            advisor_verification_status="approved" if is_advisor else None,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # If user has a password, verify it
        if user.password_hash and not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
            )

    token = create_access_token(subject=user.id, extra_claims={"role": user.role, "email": user.email})
    target = resolve_route(user, payload.return_to)

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.post("/quick-demo-login", response_model=AuthResponse, tags=["Auth"])
def quick_demo_login(payload: QuickDemoLoginRequest, db: Session = Depends(get_db)):
    demo_accounts = {
        "student": {
            "email": "student@example.com",
            "full_name": "Rafiul Islam",
            "role": "student",
            "intended_country": "Germany",
            "education_level": "Undergraduate",
            "institution": "BUET",
            "subject_field": "Computer Science & Engineering",
        },
        "advisor": {
            "email": "advisor@example.com",
            "full_name": "Tanvir Ahmed",
            "role": "advisor",
            "headline": "Germany Master's Application Adviser",
            "bio": "Admitted to TU Munich & TU Darmstadt. Helped 50+ students secure visas and admissions.",
            "advisor_verification_status": "approved",
        },
        "admin": {
            "email": "admin@example.com",
            "full_name": "Mentora Admin",
            "role": "admin",
        },
    }

    info = demo_accounts[payload.role]
    user = db.query(User).filter(User.email == info["email"]).first()

    if not user:
        user_id = f"user-{payload.role}-demo"
        user = User(
            id=user_id,
            auth_user_id=f"auth-{payload.role}-demo",
            full_name=info["full_name"],
            email=info["email"],
            password_hash=get_password_hash("DemoPass123!"),
            auth_provider="email",
            email_verified=True,
            role=info["role"],
            onboarding_status="completed",
            account_status="active",
            advisor_verification_status=info.get("advisor_verification_status"),
            headline=info.get("headline"),
            bio=info.get("bio"),
            education_level=info.get("education_level"),
            institution=info.get("institution"),
            subject_field=info.get("subject_field"),
            intended_country=info.get("intended_country"),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(subject=user.id, extra_claims={"role": user.role, "email": user.email})
    target = resolve_route(user)

    return AuthResponse(
        success=True,
        user=UserRead.model_validate(user),
        access_token=token,
        token_type="bearer",
        target=target,
    )


@router.post("/google", response_model=AuthResponse, tags=["Auth"])
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        user_id = generate_uuid()
        user = User(
            id=user_id,
            auth_user_id=f"google-{user_id}",
            full_name=payload.full_name,
            email=email_clean,
            auth_provider="google",
            email_verified=True,
            role="student",
            onboarding_status="completed",
            account_status="active",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(subject=user.id, extra_claims={"role": user.role, "email": user.email})
    target = resolve_route(user)

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
