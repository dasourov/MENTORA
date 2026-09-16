from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.api.deps import get_current_user, require_role

router = APIRouter()


def _normalize_identifier(raw: str) -> str:
    cleaned = raw.strip()
    # Support "id=xxx" format as well as leading "@"
    if cleaned.lower().startswith("id="):
        cleaned = cleaned[3:]
    elif cleaned.startswith("@"):
        cleaned = cleaned[1:]
    return cleaned.strip()


@router.get("/", response_model=List[UserRead], tags=["Users"])
def get_users(
    skip: int = 0,
    limit: int = 50,
    role: Optional[str] = None,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    """Admin-only: list registered users."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.offset(skip).limit(limit).all()


@router.get("/{identifier}", response_model=UserRead, tags=["Users"])
def get_user_by_identifier(identifier: str, db: Session = Depends(get_db)):
    """Look up a user profile by ID, username, or auth ID."""
    clean_id = _normalize_identifier(identifier)
    user = (
        db.query(User)
        .filter(
            or_(
                User.id == clean_id,
                User.username == clean_id.lower(),
                User.auth_user_id == clean_id,
            )
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.patch("/me", response_model=UserRead, tags=["Users"])
def update_profile_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's own profile."""
    update_data = payload.model_dump(exclude_unset=True)

    if "username" in update_data and update_data["username"]:
        desired_username = update_data["username"].strip().lower()
        conflict = (
            db.query(User)
            .filter(User.username == desired_username, User.id != current_user.id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Username '{desired_username}' is already taken.",
            )
        update_data["username"] = desired_username

    for key, value in update_data.items():
        setattr(current_user, key, value)

    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/{identifier}", response_model=UserRead, tags=["Users"])
def update_user_by_identifier(
    identifier: str,
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile by ID or username with strict authorization."""
    clean_id = _normalize_identifier(identifier)
    target_user = (
        db.query(User)
        .filter(
            or_(
                User.id == clean_id,
                User.username == clean_id.lower(),
                User.auth_user_id == clean_id,
            )
        )
        .first()
    )
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Security check: User can only update their own profile unless they are an admin
    if current_user.id != target_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this user's profile.",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "username" in update_data and update_data["username"]:
        desired_username = update_data["username"].strip().lower()
        conflict = (
            db.query(User)
            .filter(User.username == desired_username, User.id != target_user.id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Username '{desired_username}' is already taken.",
            )
        update_data["username"] = desired_username

    for key, value in update_data.items():
        setattr(target_user, key, value)

    target_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(target_user)
    return target_user
