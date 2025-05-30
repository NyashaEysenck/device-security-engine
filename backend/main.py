from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from routers import security, network, audit, auth
from config import Config
from contextlib import asynccontextmanager
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    if Config.AUTO_START_SCANNER:
        from services.network_service import start_background_scanner
        start_background_scanner()
    yield
    # Shutdown logic

app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(security.router)
app.include_router(network.router)
app.include_router(audit.router)
app.include_router(auth.router)


from pydantic import BaseModel
import serial
from serial.tools import list_ports
import threading
import time
 
# Serial connection manager
arduino = None
lock = threading.Lock()

 
class ConnectionRequest(BaseModel):
    port: str
    baud_rate: int = 9600

class CommandRequest(BaseModel):
    command: str

@app.get("/arduino/ports")
def get_available_ports():
    """List available serial ports"""
    ports = [port.device for port in list_ports.comports()]
    return {"ports": ports}

@app.post("/arduino/connect")
def connect_to_arduino(request: ConnectionRequest):
    """Connect to Arduino device"""
    global arduino
    try:
        with lock:
            if arduino and arduino.is_open:
                arduino.close()
            arduino = serial.Serial(
                port=request.port,
                baudrate=request.baud_rate,
                timeout=1
            )
            time.sleep(2)  # Allow time for connection
            return {"status": "connected", "port": request.port}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/arduino/disconnect")
def disconnect_arduino():
    """Disconnect from Arduino"""
    global arduino
    with lock:
        if arduino and arduino.is_open:
            arduino.close()
            arduino = None
            return {"status": "disconnected"}
        return {"status": "already disconnected"}

@app.get("/arduino/status")
def get_connection_status():
    """Get current connection status"""
    global arduino
    status = "disconnected"
    if arduino and arduino.is_open:
        status = "connected"
    return {"status": status, "port": arduino.port if arduino else None}

@app.post("/arduino/command")
def send_command(request: CommandRequest):
    """Send command to Arduino"""
    global arduino
    if not arduino or not arduino.is_open:
        raise HTTPException(status_code=400, detail="Not connected to Arduino")
    
    try:
        with lock:
            arduino.write(f"{request.command}\n".encode())
            response = arduino.readline().decode().strip()
            return {"command": request.command, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Static files and SPA
assets_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist", "assets"))
app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/{path:path}")
async def serve_spa(path: str):
    index_path = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist", "index.html")))
    if not index_path.exists():
        return {"error": "Frontend not built. Run 'npm run build' first."}
    return FileResponse(index_path)