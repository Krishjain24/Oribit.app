from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    builder_type = Column(String(50), default="fullstack")  # "frontend", "fullstack", "teams", "other"
    company = Column(String(255), nullable=True)
    github_handle = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    preferences = Column(JSON, default=dict)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship("User", back_populates="profile")
