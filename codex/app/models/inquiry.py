from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, Text
from app.core.database import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    company = Column(String(255), nullable=True)
    inquiry_type = Column(String(50), default="demo", nullable=False)  # demo, sales, partnership, general
    message = Column(Text, nullable=False)
    status = Column(String(50), default="new", nullable=False)  # new, in_review, contacted, closed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
