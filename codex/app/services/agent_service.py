from datetime import datetime, timezone
import json
import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings

logger = logging.getLogger("orbit.agent_service")


class AgentService:
    @staticmethod
    def generate_plan(prompt: str, builder_role: str = "fullstack") -> List[Dict[str, Any]]:
        """
        Synthesize an agent plan tailored to the prompt and builder archetype:
        Frontend, Fullstack, or Teams.
        """
        clean_prompt = prompt.strip()
        lower_prompt = clean_prompt.lower()

        # Heuristic contextual step templates
        if any(term in lower_prompt for term in ["storefront", "shop", "cart", "product", "gallery"]):
            steps = [
                {
                    "step_number": 1,
                    "title": "Plan ready",
                    "description": "Mapped the page structure and component boundaries",
                    "status": "done",
                    "time_label": "2m",
                    "details": "Parsed design tokens and product layout hierarchy."
                },
                {
                    "step_number": 2,
                    "title": "Building gallery",
                    "description": "Updating 3 components with smooth transitions",
                    "status": "active",
                    "time_label": "now",
                    "details": "Modifying ProductGallery.vue, ImageCarousel.tsx, and theme.css."
                },
                {
                    "step_number": 3,
                    "title": "Reviewing checks",
                    "description": "Browser previews and layout responsiveness validated",
                    "status": "pending",
                    "time_label": "pending",
                    "details": "Automated headless viewport tests across mobile and desktop."
                }
            ]
            files_affected = ["src/components/ProductGallery.tsx", "src/components/ImageCarousel.tsx", "src/styles/theme.css"]
            diff_summary = "+142 lines, -38 lines across 3 files"
        elif any(term in lower_prompt for term in ["auth", "login", "jwt", "user", "signup"]):
            steps = [
                {
                    "step_number": 1,
                    "title": "Security schema planned",
                    "description": "Defined JWT claims, password hashing, and role policies",
                    "status": "done",
                    "time_label": "1m",
                    "details": "Generated user model with bcrypt and refresh tokens."
                },
                {
                    "step_number": 2,
                    "title": "Implementing endpoints",
                    "description": "Writing auth router and session middleware",
                    "status": "active",
                    "time_label": "now",
                    "details": "Created /auth/login, /auth/register, and /auth/me."
                },
                {
                    "step_number": 3,
                    "title": "Verification suite",
                    "description": "Running unit tests for token expiration and edge cases",
                    "status": "pending",
                    "time_label": "pending",
                    "details": "Checked unauthorized handling, password strength, and token reuse."
                }
            ]
            files_affected = ["app/api/v1/auth.py", "app/core/security.py", "tests/test_auth.py"]
            diff_summary = "+210 lines, -0 lines across 3 files"
        else:
            steps = [
                {
                    "step_number": 1,
                    "title": "Plan mapped",
                    "description": f"Analyzed requirements for '{clean_prompt[:45]}...'",
                    "status": "done",
                    "time_label": "1m",
                    "details": "Synthesized implementation path and identified target modules."
                },
                {
                    "step_number": 2,
                    "title": "Executing implementation",
                    "description": "Applying edits and synchronizing architecture",
                    "status": "active",
                    "time_label": "now",
                    "details": "Running code transforms across frontend and backend modules."
                },
                {
                    "step_number": 3,
                    "title": "Running checks",
                    "description": "Verifying tests, linting, and live preview rendering",
                    "status": "pending",
                    "time_label": "pending",
                    "details": "Performing health checks and contract verification."
                }
            ]
            files_affected = ["src/app/main.ts", "src/styles/layout.css", "api/handlers.py"]
            diff_summary = "+85 lines, -12 lines across 3 files"

        return steps

    @classmethod
    def simulate_demo(cls, prompt: str, builder_role: str = "fullstack") -> Dict[str, Any]:
        """Produce the interactive landing page demo preview payload."""
        steps = cls.generate_plan(prompt, builder_role)
        
        # Determine affected files based on prompt
        if any(term in prompt.lower() for term in ["storefront", "shop", "product", "gallery"]):
            files = ["src/components/ProductGallery.tsx", "src/components/ImageCarousel.tsx", "src/styles/theme.css"]
            diff = "+142 lines, -38 lines across 3 files"
            proj = "atlas / storefront-refresh"
        elif any(term in prompt.lower() for term in ["dark", "theme", "color", "mode"]):
            files = ["src/theme/tokens.css", "src/components/ThemeToggle.tsx"]
            diff = "+68 lines, -14 lines across 2 files"
            proj = "orbit / theme-engine"
        else:
            files = ["src/core/workspace.ts", "src/components/View.tsx", "tests/view.spec.ts"]
            diff = "+94 lines, -20 lines across 3 files"
            proj = f"orbit / {prompt[:18].lower().replace(' ', '-')}"

        return {
            "prompt": prompt,
            "project_name": proj,
            "branch": "main",
            "steps": steps,
            "files_affected": files,
            "diff_summary": diff,
            "status": "ready"
        }

    @staticmethod
    def create_initial_logs(prompt: str) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        return [
            {"timestamp": now, "level": "INFO", "message": f"Agent task initialized with goal: '{prompt}'"},
            {"timestamp": now, "level": "INFO", "message": "Analyzing repository workspace and context graph."},
            {"timestamp": now, "level": "SUCCESS", "message": "Execution plan generated and validated."}
        ]
