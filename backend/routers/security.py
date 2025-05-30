from fastapi import APIRouter, HTTPException, Depends
from models.security import URLRequest, URLResponse, EmailRequest, EmailResponse
from services.security_service import analyze_url, analyze_email
from services.security_report_service import get_security_reports
from models.security_report import SecurityToolReport
from routers.auth import get_current_user, User
from typing import List

router = APIRouter(prefix="/api/security", tags=["Security"])

@router.post("/analyze-url", response_model=URLResponse)
def url_analysis(request: URLRequest, current_user: User = Depends(get_current_user)):
    # Only authenticated users can analyze URLs
    response = analyze_url(request.url, user=current_user)
    return response

@router.post("/analyze-email", response_model=EmailResponse)
def email_analysis(request: EmailRequest, current_user: User = Depends(get_current_user)):
    # Only authenticated users can analyze emails
    response = analyze_email(request.email_text, user=current_user)
    return response

@router.get("/reports", response_model=List[SecurityToolReport], dependencies=[Depends(get_current_user)])
def fetch_security_reports(current_user: User = Depends(get_current_user)):
    
    reports = get_security_reports()
    print(reports)
    return reports