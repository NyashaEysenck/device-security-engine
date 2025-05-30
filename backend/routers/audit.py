from fastapi import APIRouter, Query, HTTPException, Depends, Body
from typing import Optional
from datetime import datetime
from fastapi.responses import StreamingResponse
from routers.auth import get_current_user, User
from services.audit_service import (
    get_audit_logs,
    log_event,
    generate_audit_report
)

router = APIRouter(prefix="/api/network/audit", tags=["Audit"])

@router.get("", response_model=list[dict])
def get_logs(
    limit: int = 100,
    device_mac: Optional[str] = None,
    event_type: Optional[str] = Query(None, regex="^(connect|disconnect|authorize|revoke|name_change|all)$"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Only authenticated users can get logs
    return get_audit_logs(limit, device_mac, event_type, start_date, end_date)

@router.post("/log-event")
def log_network_event(
    device_mac: str,
    event_type: str,
    ip_address: Optional[str] = None,
    details: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Only authenticated users can log events
    return log_event(device_mac, event_type, ip_address, details)

@router.post("/report")
def generate_report(
    data: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    # Only authenticated users can generate reports
    return generate_audit_report(data)