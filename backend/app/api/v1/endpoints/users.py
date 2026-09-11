from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.api.deps import get_current_user, require_role

router = APIRouter()


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


@router.get("/{user_id}", response_model=UserRead, tags=["Users"])
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    """Public/adviser profile look-up."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.patch("/me", response_model=UserRead, tags=["Users"])
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update own user profile."""
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return current_user
