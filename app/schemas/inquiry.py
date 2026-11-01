from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=255)
    inquiry_type: str = Field("demo", description="demo, sales, partnership, general")
    message: str = Field(..., min_length=5, max_length=5000)


class InquiryStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|in_review|contacted|closed)$")


class InquiryRead(BaseModel):
    id: int
    name: str
    email: str
    company: Optional[str] = None
    inquiry_type: str
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
