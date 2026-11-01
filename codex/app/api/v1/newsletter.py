from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import NewsletterCreate, NewsletterRead

router = APIRouter()


@router.post("/subscribe", response_model=NewsletterRead, status_code=status.HTTP_201_CREATED)
def subscribe_newsletter(newsletter_in: NewsletterCreate, db: Session = Depends(get_db)):
    """Subscribe an email to product updates and releases."""
    clean_email = newsletter_in.email.lower().strip()
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == clean_email).first()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.unsubscribed_at = None
            db.commit()
            db.refresh(existing)
        return existing

    sub = NewsletterSubscriber(
        email=clean_email,
        source=newsletter_in.source or "landing_footer",
        is_active=True
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.post("/unsubscribe", status_code=status.HTTP_200_OK)
def unsubscribe_newsletter(newsletter_in: NewsletterCreate, db: Session = Depends(get_db)):
    """Unsubscribe an email address from the newsletter."""
    clean_email = newsletter_in.email.lower().strip()
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == clean_email).first()
    if not sub or not sub.is_active:
        return {"message": "Email is already unsubscribed."}

    sub.is_active = False
    sub.unsubscribed_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Successfully unsubscribed from updates."}
