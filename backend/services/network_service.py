import threading
import time
from datetime import datetime, timedelta
from pymongo import MongoClient
from scapy.all import ARP, Ether, srp
from config import Config
from models.network import Device, NetworkStatus
from fastapi import HTTPException
from bson import ObjectId
from typing import List
from services.audit_service import log_event

client = MongoClient(Config.MONGODB_URI)
db = client.muchengeti
devices_collection = db.devices
scanning_active = False

def scan_network(ip_range: str = Config.DEFAULT_NETWORK_RANGE) -> list[dict]:
    """Perform ARP scan of the network"""
    try:
        arp = ARP(pdst=ip_range)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp
        result = srp(packet, timeout=3, verbose=0)[0]
        
        return [{
            'ip': received.psrc,
            'mac': received.hwsrc.lower()
        } for sent, received in result]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

def background_scanner(ip_range: str, interval: int):
    """Continuous scanning in background"""
    global scanning_active
    while scanning_active:
        try:
            scanned_devices = scan_network(ip_range)
            now = datetime.now()
            
            for device in scanned_devices:
                update_device_in_db(device['ip'], device['mac'], now)
            
            check_disconnected_devices([d['ip'] for d in scanned_devices])
            
        except Exception as e:
            print(f"Scan error: {str(e)}")
        time.sleep(interval)

def update_device_in_db(ip: str, mac: str, timestamp: datetime):
    """Update or create device record with audit logging"""
    device = devices_collection.find_one({"mac": mac})
    device_name = device.get("name") if device else f"Device-{mac[-6:]}"
    if device:
        # Device reconnected
        if device['ip'] != ip:
            log_event(
                device_mac=mac,
                event_type="connect",
                ip_address=ip,
                details=f"IP changed from {device['ip']} to {ip}",
                device_name=device_name
            )
        else:
            log_event(
                device_mac=mac,
                event_type="connect",
                ip_address=ip,
                details="Device reconnected",
                device_name=device_name
            )
        devices_collection.update_one(
            {"mac": mac},
            {"$set": {"last_seen": timestamp}}
        )
    else:
        # New device
        log_event(
            device_mac=mac,
            event_type="connect",
            ip_address=ip,
            details="First connection",
            device_name=device_name
        )
        devices_collection.insert_one({
            "ip": ip,
            "mac": mac,
            "authorized": False,
            "first_seen": timestamp,
            "last_seen": timestamp,
            "name": device_name
        })

def check_disconnected_devices(current_ips: List[str]):
    """Check for devices that have disconnected"""
    five_min_ago = datetime.now() - timedelta(minutes=5)
    connected_devices = devices_collection.find({
        "last_seen": {"$gte": five_min_ago}
    })
    connected_ips = [d['ip'] for d in connected_devices]
    
    disconnected = devices_collection.find({
        "last_seen": {"$lt": five_min_ago},
        "ip": {"$nin": connected_ips}
    })
    
    for device in disconnected:
        log_event(
            device_mac=device['mac'],
            event_type="disconnect",
            ip_address=device['ip'],
            details=f"Disconnected after {datetime.now() - device['last_seen']}",
            device_name=device.get('name')
        )

def is_scan_active() -> bool:
    global scanning_active
    return scanning_active

def fix_mongo_id(doc):
    if '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    return doc

def get_current_devices() -> list[Device]:
    five_min_ago = datetime.now() - timedelta(minutes=5)
    devices = list(devices_collection.find({
        "last_seen": {"$gte": five_min_ago}
    }))
    return [fix_mongo_id(device) for device in devices]

def get_devices() -> list[Device]:
    return get_current_devices()

def start_scan(interval: int = Config.SCAN_INTERVAL):
    global scanning_active
    if not scanning_active:
        scanning_active = True
        thread = threading.Thread(
            target=background_scanner,
            args=(Config.DEFAULT_NETWORK_RANGE, interval),
            daemon=True
        )
        thread.start()
        return {"message": "Scanner started"}
    return {"message": "Scanner already running"}

def stop_scan():
    global scanning_active
    scanning_active = False
    return {"message": "Scanner stopped"}

def send_arduino_led_command(unauthorized_devices: int):
    """
    Send LED command to Arduino depending on unauthorized device count.
    - If unauthorized_devices > 0: RED_ON
    - Else: GREEN_ON
    """
    import requests
    import os
    backend_url = os.getenv("ARDUINO_BACKEND_URL", "http://localhost:8000")
    try:
        if unauthorized_devices > 0:
            cmd = "RED_ON"
        else:
            cmd = "GREEN_ON"
        # Send command to backend's /arduino/command endpoint
        resp = requests.post(f"{backend_url}/arduino/command", json={"command": cmd})
        resp.raise_for_status()
    except Exception as e:
        print(f"[WARN] Could not send LED command to Arduino: {e}")

def get_network_status() -> NetworkStatus:
    devices = get_current_devices()
    unauthorized = sum(1 for d in devices if not d['authorized'])
    # --- Arduino LED Integration ---
    send_arduino_led_command(unauthorized)
    return NetworkStatus(
        secure=unauthorized == 0,
        connected_devices=len(devices),
        unauthorized_devices=unauthorized
    )

def authorize_device(device_id: str, authorized: bool = True):
    result = devices_collection.update_one(
        {"mac": device_id},
        {"$set": {"authorized": authorized}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Device not found")
    # Fetch device info for audit log
    device = devices_collection.find_one({"mac": device_id})
    event_type = "authorize" if authorized else "revoke"
    details = "Device authorized" if authorized else "Device unauthorized"
    log_event(
        device_mac=device_id,
        event_type=event_type,
        ip_address=device.get("ip") if device else None,
        details=details,
        device_name=device.get("name") if device else None
    )
    # --- Arduino LED Integration ---
    # After authorization change, update LED
    devices = get_current_devices()
    unauthorized = sum(1 for d in devices if not d['authorized'])
    send_arduino_led_command(unauthorized)
    return {"message": "Device authorization updated"}

def update_device_name(device_id: str, name: str):
    # Fetch current device for old name
    device = devices_collection.find_one({"mac": device_id})
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    old_name = device.get("name", "")
    result = devices_collection.update_one(
        {"mac": device_id},
        {"$set": {"name": name}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Device not found or name unchanged")
    # Log name change event
    log_event(
        device_mac=device_id,
        event_type="name_change",
        ip_address=device.get("ip"),
        details=f"Device name changed from '{old_name}' to '{name}'",
        device_name=name
    )
    return {"message": "Device name updated"}