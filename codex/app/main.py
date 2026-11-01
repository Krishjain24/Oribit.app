from contextlib import asynccontextmanager
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.api import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.services.auth_service import AuthService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle:
    - Automatically creates database tables (PostgreSQL/Supabase or SQLite)
    - Seeds default administrator account if not present
    """
    # 1. Initialize DB tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed default admin
    db = SessionLocal()
    try:
        AuthService.seed_default_admin(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Mission Control Backend for Orbit — The Agent-First Workspace. "
        "Provides Early Access Waitlist, Inquiries, User Authentication (JWT), "
        "Workspaces, AI Agent Orchestration, and Admin Control."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Paths
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
FRONTEND_DIR = BASE_DIR.parent / "frontend"
if not (FRONTEND_DIR / "index.html").exists():
    FRONTEND_DIR = BASE_DIR.parent

# Mount static assets for Admin Dashboard
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for container uptime and readiness probes."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/admin", include_in_schema=False)
def serve_admin():
    """Serve the Orbit Mission Control Admin Dashboard."""
    admin_index = STATIC_DIR / "admin" / "index.html"
    return FileResponse(str(admin_index))


# Mount the frontend directory directly at root.
# This serves index.html at "/", and cleanly resolves styles.css, script.js, orbit-api.js, etc.
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

