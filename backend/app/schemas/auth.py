from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    return_to: Optional[str] = None


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[Literal["student", "advisor"]] = None


class QuickDemoLoginRequest(BaseModel):
    role: Literal["student", "advisor", "admin"]


class CheckEmailRequest(BaseModel):
    email: EmailStr


class CheckEmailResponse(BaseModel):
    exists: bool
    verified: bool = False


class GoogleAuthRequest(BaseModel):
    email: EmailStr
    full_name: str
    id_token: Optional[str] = None


class SelectRoleRequest(BaseModel):
    role: Literal["student", "advisor"]


class VerifyEmailRequest(BaseModel):
    code: Optional[str] = None
