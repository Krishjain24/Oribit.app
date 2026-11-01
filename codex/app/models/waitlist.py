from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, Text
from app.core.database import Base


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    builder_role = Column(String(50), default="fullstack", nullable=False)  # frontend, fullstack, teams, other
    company = Column(String(255), nullable=True)
    use_case = Column(Text, nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, approved, invited, rejected
    priority_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
