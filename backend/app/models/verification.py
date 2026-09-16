import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from app.core.database import Base


def generate_verification_id() -> str:
    return f"verif-{uuid.uuid4().hex[:12]}"


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(String(64), primary_key=True, default=generate_verification_id, index=True)
    email = Column(String(255), index=True, nullable=False)
    code = Column(String(16), nullable=False)
    purpose = Column(String(32), default="registration", nullable=False)  # "registration", "reset_password"
    expires_at = Column(DateTime, nullable=False, index=True)
    attempts = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=5, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def is_valid(self, code_input: str) -> bool:
        """Checks if verification code matches and is still within time and attempt limits."""
        now = datetime.now(timezone.utc)
        
        # Ensure timezone-aware comparison
        expiry = self.expires_at
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if self.is_used:
            return False
        if now > expiry:
            return False
        if self.attempts >= self.max_attempts:
            return False

        return self.code.strip() == code_input.strip()

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "purpose": self.purpose,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "attempts": self.attempts,
            "max_attempts": self.max_attempts,
            "is_used": self.is_used,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
