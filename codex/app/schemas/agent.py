from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AgentStep(BaseModel):
    step_number: int
    title: str
    description: str
    status: str = "pending"  # "pending", "active", "done"
    time_label: Optional[str] = "now"
    details: Optional[str] = None


class AgentPlanResponse(BaseModel):
    prompt: str
    summary: str
    steps: List[AgentStep]


class AgentTaskCreate(BaseModel):
    prompt: str = Field(..., min_length=3, description="Task goal or prompt for Orbit agents")
    project_id: Optional[int] = None


class AgentTaskRead(BaseModel):
    id: int
    user_id: int
    project_id: Optional[int] = None
    prompt: str
    status: str
    plan: List[Dict[str, Any]]
    current_step_index: int
    logs: List[Dict[str, Any]]
    artifacts: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AgentDemoRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=500, description="Goal to simulate in the Orbit preview")
    builder_role: Optional[str] = "fullstack"


class AgentDemoResponse(BaseModel):
    prompt: str
    project_name: str
    branch: str
    steps: List[Dict[str, Any]]
    files_affected: List[str]
    diff_summary: str
    status: str = "ready"
