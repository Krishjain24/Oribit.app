import logging
from typing import Optional

logger = logging.getLogger("orbit.email_service")


class EmailService:
    @staticmethod
    def send_waitlist_confirmation(email: str, name: Optional[str], queue_position: int) -> bool:
        """Simulate or dispatch waitlist welcome email."""
        recipient = name or email
        logger.info(
            f"[EMAIL DISPATCH] To: {email} | Subject: Welcome to the Orbit Waitlist! | "
            f"Hello {recipient}, you are #{queue_position} in line for early access."
        )
        return True

    @staticmethod
    def send_inquiry_notification(name: str, email: str, inquiry_type: str, message: str) -> bool:
        """Send admin notification for demo / inquiry requests."""
        logger.info(
            f"[ADMIN ALERT] New {inquiry_type} inquiry from {name} ({email}): {message[:100]}..."
        )
        return True
