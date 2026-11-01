from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryRead
from app.services.email_service import EmailService

router = APIRouter()


@router.post("/", response_model=InquiryRead, status_code=status.HTTP_201_CREATED)
def submit_inquiry(inquiry_in: InquiryCreate, db: Session = Depends(get_db)):
    """Submit a contact or product demo inquiry."""
    inquiry = Inquiry(
        name=inquiry_in.name,
        email=inquiry_in.email.lower().strip(),
        company=inquiry_in.company,
        inquiry_type=inquiry_in.inquiry_type,
        message=inquiry_in.message,
        status="new"
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    EmailService.send_inquiry_notification(
        name=inquiry.name,
        email=inquiry.email,
        inquiry_type=inquiry.inquiry_type,
        message=inquiry.message
    )
    return inquiry
