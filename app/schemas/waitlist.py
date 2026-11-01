from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class WaitlistCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=255)
    builder_role: str = Field("fullstack", description="frontend, fullstack, teams, or other")
    company: Optional[str] = Field(None, max_length=255)
    use_case: Optional[str] = Field(None, max_length=1000)


class WaitlistStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|invited|rejected)$")


class WaitlistRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    builder_role: str
    company: Optional[str] = None
    use_case: Optional[str] = None
    status: str
    priority_score: int
    created_at: datetime
    queue_position: Optional[int] = None

    class Config:
        from_attributes = True
