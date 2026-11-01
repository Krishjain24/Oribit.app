from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.waitlist import WaitlistEntry
from app.schemas.waitlist import WaitlistCreate, WaitlistRead
from app.services.email_service import EmailService

router = APIRouter()


@router.post("/", response_model=WaitlistRead, status_code=status.HTTP_201_CREATED)
def join_waitlist(entry_in: WaitlistCreate, db: Session = Depends(get_db)):
    """
    Register an email for early access waitlist.
    Validates email format, prevents duplicate signups, computes queue number,
    and sends confirmation.
    """
    clean_email = entry_in.email.lower().strip()
    existing = db.query(WaitlistEntry).filter(WaitlistEntry.email == clean_email).first()
    if existing:
        # Calculate existing position
        pos = db.query(WaitlistEntry).filter(WaitlistEntry.id <= existing.id).count()
        response_data = WaitlistRead.model_validate(existing)
        response_data.queue_position = pos
        return response_data

    # Priority score: teams get slight priority
    priority = 10 if entry_in.builder_role == "teams" else 5

    entry = WaitlistEntry(
        email=clean_email,
        full_name=entry_in.full_name,
        builder_role=entry_in.builder_role,
        company=entry_in.company,
        use_case=entry_in.use_case,
        status="pending",
        priority_score=priority
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Calculate queue position
    pos = db.query(WaitlistEntry).filter(WaitlistEntry.id <= entry.id).count()
    EmailService.send_waitlist_confirmation(entry.email, entry.full_name, pos)

    response_data = WaitlistRead.model_validate(entry)
    response_data.queue_position = pos
    return response_data


@router.get("/status", response_model=WaitlistRead)
def check_waitlist_status(email: str = Query(..., description="Email address to check"), db: Session = Depends(get_db)):
    """Check waitlist status and queue position for a registered email."""
    clean_email = email.lower().strip()
    entry = db.query(WaitlistEntry).filter(WaitlistEntry.email == clean_email).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email address not found in early access waitlist."
        )
    pos = db.query(WaitlistEntry).filter(WaitlistEntry.id <= entry.id).count()
    response_data = WaitlistRead.model_validate(entry)
    response_data.queue_position = pos
    return response_data
