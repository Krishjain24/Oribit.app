from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.project import Project
from app.models.agent import AgentTask
from app.schemas.agent import (
    AgentDemoRequest,
    AgentDemoResponse,
    AgentPlanResponse,
    AgentTaskCreate,
    AgentTaskRead
)
from app.services.agent_service import AgentService

router = APIRouter()


@router.post("/demo", response_model=AgentDemoResponse)
def run_agent_demo(request: AgentDemoRequest):
    """
    Public interactive agent demo endpoint for the Orbit landing page hero section.
    Takes a user's natural language intent and returns mapped steps, affected files,
    and preview diffs.
    """
    return AgentService.simulate_demo(request.prompt, request.builder_role or "fullstack")


@router.post("/tasks", response_model=AgentTaskRead, status_code=status.HTTP_201_CREATED)
def create_agent_task(
    task_in: AgentTaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new AI agent task within a project workspace."""
    if task_in.project_id:
        project = db.query(Project).filter(
            Project.id == task_in.project_id,
            Project.user_id == current_user.id
        ).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    initial_plan = AgentService.generate_plan(task_in.prompt)
    initial_logs = AgentService.create_initial_logs(task_in.prompt)

    task = AgentTask(
        user_id=current_user.id,
        project_id=task_in.project_id,
        prompt=task_in.prompt,
        status="in_progress",
        plan=initial_plan,
        current_step_index=1,
        logs=initial_logs,
        artifacts={"summary": f"Orchestrated plan with {len(initial_plan)} milestones."}
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/tasks", response_model=List[AgentTaskRead])
def list_agent_tasks(
    project_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List agent tasks for current user, optionally filtered by project."""
    query = db.query(AgentTask).filter(AgentTask.user_id == current_user.id)
    if project_id:
        query = query.filter(AgentTask.project_id == project_id)
    return query.order_by(AgentTask.created_at.desc()).all()


@router.get("/tasks/{task_id}", response_model=AgentTaskRead)
def get_agent_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get status, plan, logs, and artifacts of a specific agent task."""
    task = db.query(AgentTask).filter(
        AgentTask.id == task_id,
        AgentTask.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent task not found")
    return task


@router.post("/tasks/{task_id}/step", response_model=AgentTaskRead)
def advance_agent_step(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Advance the agent to execute its next planned step."""
    task = db.query(AgentTask).filter(
        AgentTask.id == task_id,
        AgentTask.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent task not found")

    plan = list(task.plan or [])
    curr = task.current_step_index
    logs = list(task.logs or [])
    now = datetime.now(timezone.utc).isoformat()

    if curr < len(plan):
        plan[curr]["status"] = "done"
        plan[curr]["time_label"] = "just now"
        logs.append({
            "timestamp": now,
            "level": "SUCCESS",
            "message": f"Step {curr + 1} completed: {plan[curr].get('title')}"
        })
        curr += 1
        if curr < len(plan):
            plan[curr]["status"] = "active"
            plan[curr]["time_label"] = "now"
            logs.append({
                "timestamp": now,
                "level": "INFO",
                "message": f"Starting Step {curr + 1}: {plan[curr].get('title')}"
            })
            task.status = "in_progress"
        else:
            task.status = "completed"
            logs.append({
                "timestamp": now,
                "level": "DONE",
                "message": "All agent execution steps successfully completed."
            })
    else:
        task.status = "completed"

    task.plan = plan
    task.current_step_index = curr
    task.logs = logs
    db.commit()
    db.refresh(task)
    return task
