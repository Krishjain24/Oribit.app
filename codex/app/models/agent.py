from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    prompt = Column(Text, nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, planning, in_progress, completed, failed
    plan = Column(JSON, default=list)  # List of step objects: [{"id": 1, "title": "...", "status": "done"}]
    current_step_index = Column(Integer, default=0)
    logs = Column(JSON, default=list)  # List of log entries: [{"timestamp": "...", "message": "..."}]
    artifacts = Column(JSON, default=dict)  # Generated diffs, files, or summary
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship("User", back_populates="agent_tasks")
    project = relationship("Project", back_populates="agent_tasks")
