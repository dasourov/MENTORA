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


class CheckEmailRequest(BaseModel):
    email: EmailStr


class CheckEmailResponse(BaseModel):
    exists: bool
    verified: bool = False


class SelectRoleRequest(BaseModel):
    role: Literal["student", "advisor"]


class VerifyEmailRequest(BaseModel):
    code: Optional[str] = None


class SendPasscodeRequest(BaseModel):
    email: EmailStr
    purpose: str = "registration"


class VerifyPasscodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=4, max_length=16)


class PasscodeResponse(BaseModel):
    success: bool = True
    message: str
    email: str
    expires_in_seconds: int = 600


class RegisterResponse(BaseModel):
    success: bool = True
    requires_verification: bool = True
    email: str
    message: str
    access_token: Optional[str] = None
    token_type: str = "bearer"
    target: Optional[str] = None

