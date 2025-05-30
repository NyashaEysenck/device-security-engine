import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MONGODB_URI = os.getenv("MONGODB_URI")
    AUTO_START_SCANNER = os.getenv("AUTO_START_SCANNER", "false").lower() == "true"
    DEFAULT_NETWORK_RANGE = os.getenv("DEFAULT_NETWORK_RANGE", "192.168.1.0/24")
    SCAN_INTERVAL = int(os.getenv("SCAN_INTERVAL", "60"))