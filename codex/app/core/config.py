import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Orbit Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./orbit.db"

    @field_validator("DATABASE_URL", mode="before")
    def fix_database_url(cls, v: str) -> str:
        if isinstance(v, str):
            # Cloud providers like Supabase or Heroku sometimes use postgres://
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql://", 1)
        return v

    # JWT Authentication
    SECRET_KEY: str = "orbit-super-secret-jwt-key-change-this-in-production-random-32-bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Default Admin Seed
    DEFAULT_ADMIN_EMAIL: str = "admin@orbit.dev"
    DEFAULT_ADMIN_PASSWORD: str = "OrbitAdminPassword2026!"
    DEFAULT_ADMIN_NAME: str = "Orbit Administrator"

    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://website-codex-red.vercel.app",
        "*"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def parse_cors(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.strip() == "*":
                return ["*"]
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # AI Agent Provider Keys (Optional)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
