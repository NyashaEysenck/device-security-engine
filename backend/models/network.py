from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Device(BaseModel):
    ip: str
    mac: str
    authorized: bool = False
    first_seen: datetime
    last_seen: datetime
    name: Optional[str] = None

class NetworkStatus(BaseModel):
    secure: bool
    connected_devices: int
    unauthorized_devices: int