from models.security_report import SecurityToolReport
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from typing import List
from config import Config

client = MongoClient(Config.MONGODB_URI)
db = client.muchengeti
collection = db.security_reports

def save_security_report(report: SecurityToolReport) -> SecurityToolReport:
    data = report.dict()
    data["timestamp"] = datetime.now()
    result = collection.insert_one(data)
    data["id"] = str(result.inserted_id)
    return SecurityToolReport(**data)

def get_security_reports() -> list:
    reports = list(collection.find())
    print(f"DEBUG: Retrieved {len(reports)} security reports from DB")
    for report in reports:
        report["id"] = str(report["_id"])
        if "timestamp" in report and not isinstance(report["timestamp"], str):
            report["timestamp"] = report["timestamp"].isoformat()
    return reports
