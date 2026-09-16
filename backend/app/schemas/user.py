from typing import Optional, List, Dict, Any, Literal
import re
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    username: Optional[str] = None
    auth_provider: str = "email"
    email_verified: bool = False
    role: Optional[Literal["student", "advisor", "admin"]] = None
    onboarding_status: Optional[str] = "role_selection"
    current_step: Optional[str] = None
    account_status: str = "active"
    advisor_verification_status: Optional[Literal["pending", "approved", "rejected"]] = None

    phone_number: Optional[str] = None
    country: Optional[str] = "Bangladesh"
    headline: Optional[str] = None
    bio: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    subject_field: Optional[str] = None
    intended_country: Optional[str] = None
    budget: Optional[str] = None
    services_needed: Optional[List[str]] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9_\-]{3,30}$", v):
            raise ValueError("Username must be between 3 and 30 characters and contain only letters, numbers, underscores, or hyphens.")
        return v


class UserRead(UserBase):
    id: str
    auth_user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    role: Optional[Literal["student", "advisor", "admin"]] = None
    email_verified: Optional[bool] = None
    onboarding_status: Optional[str] = None
    current_step: Optional[str] = None
    advisor_verification_status: Optional[Literal["pending", "approved", "rejected"]] = None

    phone_number: Optional[str] = None
    country: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    subject_field: Optional[str] = None
    intended_country: Optional[str] = None
    budget: Optional[str] = None
    services_needed: Optional[List[str]] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9_\-]{3,30}$", v):
            raise ValueError("Username must be between 3 and 30 characters and contain only letters, numbers, underscores, or hyphens.")
        return v


class OnboardingStepRequest(BaseModel):
    step_name: str
    is_last_step: bool = False
    step_data: Dict[str, Any] = {}


class AuthResponse(BaseModel):
    success: bool = True
    user: UserRead
    access_token: str
    token_type: str = "bearer"
    target: str
