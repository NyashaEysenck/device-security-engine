from pydantic import BaseModel
from typing import Optional, List

class URLRequest(BaseModel):
    url: str

class URLResponse(BaseModel):
    isMalicious: bool
    confidence: float
    reason: Optional[str] = None

class EmailRequest(BaseModel):
    email_text: str

class EmailResponse(BaseModel):
    isPhishing: bool
    confidence: float
    reasons: Optional[List[str]] = None