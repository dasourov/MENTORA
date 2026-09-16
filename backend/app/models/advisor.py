from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, Integer, Float
from app.core.database import Base


class Advisor(Base):
    __tablename__ = "advisors"

    id = Column(String(64), primary_key=True, index=True)  # slug id e.g. "tanvir-ahmed"
    name = Column(String(255), nullable=False, index=True)
    headline = Column(String(512), nullable=False)
    location = Column(String(255), nullable=False)
    countries = Column(JSON, default=list, nullable=False)  # list of country names
    specialisation = Column(String(255), nullable=False)
    expertise = Column(JSON, default=list, nullable=False)  # list of skills/tags
    levels = Column(JSON, default=list, nullable=False)  # list of study levels
    languages = Column(JSON, default=list, nullable=False)  # list of languages
    years = Column(Integer, default=0, nullable=False)
    rating = Column(Float, default=5.0, nullable=False, index=True)
    reviews = Column(Integer, default=0, nullable=False, index=True)
    students = Column(Integer, default=0, nullable=False)
    price = Column(Integer, default=1000, nullable=False, index=True)
    match = Column(Integer, default=85, nullable=False)
    match_reason = Column(Text, nullable=True)
    next_available = Column(String(128), nullable=True)
    response_time = Column(String(128), nullable=True)
    bio = Column(Text, nullable=True)
    approach = Column(Text, nullable=True)
    commission = Column(Text, nullable=True)
    verified = Column(Boolean, default=True, nullable=False, index=True)
    services = Column(JSON, default=list, nullable=False)
    photo = Column(String(512), nullable=True)

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
            "name": self.name,
            "headline": self.headline,
            "location": self.location,
            "countries": self.countries or [],
            "specialisation": self.specialisation,
            "expertise": self.expertise or [],
            "levels": self.levels or [],
            "languages": self.languages or [],
            "years": self.years,
            "rating": self.rating,
            "reviews": self.reviews,
            "students": self.students,
            "price": self.price,
            "match": self.match,
            "matchReason": self.match_reason or "",
            "nextAvailable": self.next_available or "",
            "responseTime": self.response_time or "",
            "bio": self.bio or "",
            "approach": self.approach or "",
            "commission": self.commission or "",
            "verified": self.verified,
            "services": self.services or [],
            "photo": self.photo or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
