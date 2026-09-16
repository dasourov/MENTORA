import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from app.core.database import Base


def generate_uuid() -> str:
    return f"user-{uuid.uuid4().hex[:12]}"


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    auth_user_id = Column(String(64), unique=True, index=True, default=generate_uuid)
    username = Column(String(64), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    auth_provider = Column(String(32), default="email", nullable=False)  # "email", "google"
    email_verified = Column(Boolean, default=False, nullable=False)
    
    # Role & Access
    role = Column(String(32), nullable=True)  # "student", "advisor", "admin"
    onboarding_status = Column(String(64), default="role_selection", nullable=True)
    current_step = Column(String(64), nullable=True)
    account_status = Column(String(32), default="active", nullable=False)  # "active", "suspended", "deleted"
    advisor_verification_status = Column(String(32), nullable=True)  # "pending", "approved", "rejected"

    # Profile Attributes
    phone_number = Column(String(64), nullable=True)
    country = Column(String(128), default="Bangladesh", nullable=True)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    education_level = Column(String(128), nullable=True)
    institution = Column(String(255), nullable=True)
    subject_field = Column(String(128), nullable=True)
    intended_country = Column(String(128), nullable=True)
    budget = Column(String(64), nullable=True)
    services_needed = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "auth_user_id": self.auth_user_id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "auth_provider": self.auth_provider,
            "email_verified": self.email_verified,
            "role": self.role,
            "onboarding_status": self.onboarding_status,
            "current_step": self.current_step,
            "account_status": self.account_status,
            "advisor_verification_status": self.advisor_verification_status,
            "phone_number": self.phone_number,
            "country": self.country,
            "headline": self.headline,
            "bio": self.bio,
            "education_level": self.education_level,
            "institution": self.institution,
            "subject_field": self.subject_field,
            "intended_country": self.intended_country,
            "budget": self.budget,
            "services_needed": self.services_needed or [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
