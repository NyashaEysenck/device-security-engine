from fastapi import APIRouter, HTTPException, Depends
from models.network import Device, NetworkStatus
from services.network_service import (
    start_scan,
    stop_scan,
    get_devices,
    get_network_status,
    authorize_device,
    is_scan_active,
    update_device_name
)
from routers.auth import get_current_user, User
from pydantic import BaseModel

router = APIRouter(prefix="/api/network", tags=["Network"])

class AuthorizationRequest(BaseModel):
    authorized: bool

class DeviceNameRequest(BaseModel):
    name: str

@router.post("/start-scan")
def start_background_scan(current_user: User = Depends(get_current_user)):
    # Only authenticated users can start scan
    return start_scan(60)

@router.post("/stop-scan")
def stop_background_scan(current_user: User = Depends(get_current_user)):
    # Only authenticated users can stop scan
    return stop_scan()

@router.get("/devices", response_model=list[Device])
def list_devices(current_user: User = Depends(get_current_user)):
    # Only authenticated users can list devices
    return get_devices()

@router.get("/status", response_model=NetworkStatus)
def network_status(current_user: User = Depends(get_current_user)):
    # Only authenticated users can get status
    return get_network_status()

@router.get("/scan-status")
def scan_status(current_user: User = Depends(get_current_user)):
    # Only authenticated users can get scan status
    return {"scanning": is_scan_active()}

@router.post("/devices/{device_id}/authorize")
def toggle_device_authorization(
    device_id: str,
    body: AuthorizationRequest,
    current_user: User = Depends(get_current_user)
):
    # Only authenticated users can authorize/revoke devices
    return authorize_device(device_id, body.authorized)

@router.patch("/devices/{device_id}/name")
def patch_device_name(device_id: str, body: DeviceNameRequest, current_user: User = Depends(get_current_user)):
    # Only authenticated users can update device name
    return update_device_name(device_id, body.name)