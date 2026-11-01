from fastapi import APIRouter
from app.api.v1 import (
    auth,
    users,
    projects,
    agents,
    waitlist,
    inquiries,
    newsletter,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Profiles"])
api_router.include_router(projects.router, prefix="/projects", tags=["Project Workspaces"])
api_router.include_router(agents.router, prefix="/agents", tags=["AI Agent Orchestration"])
api_router.include_router(waitlist.router, prefix="/waitlist", tags=["Early Access Waitlist"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["Contact & Demo Inquiries"])
api_router.include_router(newsletter.router, prefix="/newsletter", tags=["Newsletter Subscriptions"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])
