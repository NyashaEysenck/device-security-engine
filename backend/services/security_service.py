from fastapi import HTTPException
from utils.gemini_helper import classify_url_gemini, classify_email_gemini
from models.security import URLResponse, EmailResponse
from models.security_report import SecurityToolReport
from bson import ObjectId
from services.security_report_service import save_security_report
from routers.auth import get_current_user, User
from fastapi import Depends
from datetime import datetime

def fix_mongo_id(doc):
    if '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    return doc

def analyze_url(url: str, user: User = Depends(get_current_user)) -> URLResponse:
    try:
        is_malicious, confidence, reason = classify_url_gemini(url)
        result = URLResponse(
            isMalicious=is_malicious,
            confidence=confidence,
            reason=reason
        )
        save_security_report(
            SecurityToolReport(
                timestamp=datetime.now(),
                user=user.username,
                tool="malicious_url_detector",
                input_data=url,
                result="malicious" if is_malicious else "safe",
                confidence=confidence,
                reasons=[reason] if reason else None
            )
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_email(email_text: str, user: User = Depends(get_current_user)) -> EmailResponse:
    try:
        is_phishing, confidence, reasons = classify_email_gemini(email_text)
        result = EmailResponse(
            isPhishing=is_phishing,
            confidence=confidence,
            reasons=reasons
        )
        save_security_report(
            SecurityToolReport(
                timestamp=datetime.now(),
                user=user.username,
                tool="phishing_detector",
                input_data=email_text,
                result="phishing" if is_phishing else "legitimate",
                confidence=confidence,
                reasons=reasons
            )
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))