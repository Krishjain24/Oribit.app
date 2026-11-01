import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.user import User
from app.models.project import Project
from app.models.agent import AgentTask
from app.models.waitlist import WaitlistEntry
from app.models.inquiry import Inquiry
from app.schemas.admin import DashboardStats
from app.schemas.waitlist import WaitlistRead, WaitlistStatusUpdate
from app.schemas.inquiry import InquiryRead, InquiryStatusUpdate
from app.schemas.user import UserRead

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve comprehensive system metrics and counts for the Admin Dashboard."""
    total_users = db.query(User).count()
    total_waitlist = db.query(WaitlistEntry).count()
    pending_waitlist = db.query(WaitlistEntry).filter(WaitlistEntry.status == "pending").count()
    total_inquiries = db.query(Inquiry).count()
    new_inquiries = db.query(Inquiry).filter(Inquiry.status == "new").count()
    total_projects = db.query(Project).count()
    total_agent_tasks = db.query(AgentTask).count()

    # Builder role breakdown
    role_counts = db.query(
        WaitlistEntry.builder_role,
        func.count(WaitlistEntry.id)
    ).group_by(WaitlistEntry.builder_role).all()
    builder_role_breakdown = {role: count for role, count in role_counts}

    # Inquiry type breakdown
    inquiry_counts = db.query(
        Inquiry.inquiry_type,
        func.count(Inquiry.id)
    ).group_by(Inquiry.inquiry_type).all()
    inquiry_type_breakdown = {itype: count for itype, count in inquiry_counts}

    return {
        "total_users": total_users,
        "total_waitlist": total_waitlist,
        "pending_waitlist": pending_waitlist,
        "total_inquiries": total_inquiries,
        "new_inquiries": new_inquiries,
        "total_projects": total_projects,
        "total_agent_tasks": total_agent_tasks,
        "builder_role_breakdown": builder_role_breakdown,
        "inquiry_type_breakdown": inquiry_type_breakdown,
    }


@router.get("/waitlist", response_model=List[WaitlistRead])
def list_waitlist_entries(
    status_filter: Optional[str] = Query(None, alias="status"),
    builder_role: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List and filter waitlist submissions."""
    query = db.query(WaitlistEntry)
    if status_filter:
        query = query.filter(WaitlistEntry.status == status_filter)
    if builder_role:
        query = query.filter(WaitlistEntry.builder_role == builder_role)
    
    entries = query.order_by(WaitlistEntry.created_at.desc()).offset(offset).limit(limit).all()
    return entries


@router.patch("/waitlist/{entry_id}/status", response_model=WaitlistRead)
def update_waitlist_status(
    entry_id: int,
    status_update: WaitlistStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update waitlist entry status (approved, invited, rejected)."""
    entry = db.query(WaitlistEntry).filter(WaitlistEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waitlist entry not found")
    entry.status = status_update.status
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/waitlist/export-csv")
def export_waitlist_csv(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Export all waitlist registrations to a downloadable CSV file."""
    entries = db.query(WaitlistEntry).order_by(WaitlistEntry.created_at.asc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Email", "Name", "Role", "Company", "Use Case", "Status", "Registered At"])

    for item in entries:
        writer.writerow([
            item.id,
            item.email,
            item.full_name or "",
            item.builder_role,
            item.company or "",
            item.use_case or "",
            item.status,
            item.created_at.isoformat()
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orbit_waitlist.csv"}
    )


@router.get("/inquiries", response_model=List[InquiryRead])
def list_inquiries(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = 100,
    offset: int = 0,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List contact and demo inquiries."""
    query = db.query(Inquiry)
    if status_filter:
        query = query.filter(Inquiry.status == status_filter)
    return query.order_by(Inquiry.created_at.desc()).offset(offset).limit(limit).all()


@router.patch("/inquiries/{inquiry_id}/status", response_model=InquiryRead)
def update_inquiry_status(
    inquiry_id: int,
    status_update: InquiryStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update status of a contact inquiry."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    inquiry.status = status_update.status
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("/users", response_model=List[UserRead])
def list_users(
    limit: int = 100,
    offset: int = 0,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List registered user accounts."""
    return db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()
