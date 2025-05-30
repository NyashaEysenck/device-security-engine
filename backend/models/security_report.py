from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SecurityToolReport(BaseModel):
    id: Optional[str] = None
    timestamp: datetime
    user: str
    tool: str  # e.g., 'malicious_url_detector', 'phishing_detector'
    input_data: str
    result: str
    confidence: float
    reasons: Optional[List[str]] = None
