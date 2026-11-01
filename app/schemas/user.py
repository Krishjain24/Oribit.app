from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, EmailStr, Field


class ProfileBase(BaseModel):
    bio: Optional[str] = None
    builder_type: Optional[str] = "fullstack"
    company: Optional[str] = None
    github_handle: Optional[str] = None
    avatar_url: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class ProfileUpdate(ProfileBase):
    pass


class ProfileRead(ProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"
    is_active: bool = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileRead] = None

    class Config:
        from_attributes = True
