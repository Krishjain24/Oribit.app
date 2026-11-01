from typing import Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.models.profile import Profile


class AuthService:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower().strip()).first()

    @classmethod
    def register_user(
        cls,
        db: Session,
        email: str,
        password: str,
        full_name: Optional[str] = None,
        builder_type: str = "fullstack",
        role: str = "user"
    ) -> User:
        user = User(
            email=email.lower().strip(),
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=role,
            is_active=True
        )
        db.add(user)
        db.flush()

        profile = Profile(
            user_id=user.id,
            builder_type=builder_type or "fullstack",
            bio=f"Orbit builder specializing in {builder_type or 'fullstack'} development."
        )
        db.add(profile)
        db.commit()
        db.refresh(user)
        return user

    @classmethod
    def authenticate_user(
        cls,
        db: Session,
        email: str,
        password: str
    ) -> Optional[User]:
        user = cls.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @classmethod
    def seed_default_admin(cls, db: Session) -> User:
        """Seed default admin account on startup if absent."""
        admin = cls.get_by_email(db, settings.DEFAULT_ADMIN_EMAIL)
        if not admin:
            admin = cls.register_user(
                db=db,
                email=settings.DEFAULT_ADMIN_EMAIL,
                password=settings.DEFAULT_ADMIN_PASSWORD,
                full_name=settings.DEFAULT_ADMIN_NAME,
                builder_type="teams",
                role="admin"
            )
        return admin
