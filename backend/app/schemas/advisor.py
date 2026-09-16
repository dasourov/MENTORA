from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AdvisorService(BaseModel):
    id: str
    name: str
    description: str
    duration: str
    price: int
    includes: List[str] = []


class AdvisorBase(BaseModel):
    id: str
    name: str
    headline: str
    location: str
    countries: List[str] = []
    specialisation: str
    expertise: List[str] = []
    levels: List[str] = []
    languages: List[str] = []
    years: int = 0
    rating: float = 5.0
    reviews: int = 0
    students: int = 0
    price: int = 1000
    match: int = 85
    matchReason: Optional[str] = Field(default="", alias="match_reason")
    nextAvailable: Optional[str] = Field(default="", alias="next_available")
    responseTime: Optional[str] = Field(default="", alias="response_time")
    bio: Optional[str] = ""
    approach: Optional[str] = ""
    commission: Optional[str] = ""
    verified: bool = True
    services: List[AdvisorService] = []
    photo: Optional[str] = ""

    model_config = ConfigDict(populate_by_name=True)


class AdvisorRead(AdvisorBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdvisorListResponse(BaseModel):
    total: int
    items: List[AdvisorRead]
