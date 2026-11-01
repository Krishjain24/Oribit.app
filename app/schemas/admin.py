from typing import Dict, List
from pydantic import BaseModel
from app.schemas.waitlist import WaitlistRead
from app.schemas.inquiry import InquiryRead
from app.schemas.user import UserRead


class DashboardStats(BaseModel):
    total_users: int
    total_waitlist: int
    pending_waitlist: int
    total_inquiries: int
    new_inquiries: int
    total_projects: int
    total_agent_tasks: int
    builder_role_breakdown: Dict[str, int]
    inquiry_type_breakdown: Dict[str, int]
