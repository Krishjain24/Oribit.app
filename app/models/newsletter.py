from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from app.core.database import Base


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    source = Column(String(100), default="landing_footer", nullable=False)
    subscribed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    unsubscribed_at = Column(DateTime, nullable=True)
