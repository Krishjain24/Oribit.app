from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class NewsletterCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = Field("landing_footer", max_length=100)


class NewsletterRead(BaseModel):
    id: int
    email: str
    is_active: bool
    source: str
    subscribed_at: datetime

    class Config:
        from_attributes = True
