from datetime import datetime, timedelta
from io import BytesIO
from typing import Optional
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from pymongo import MongoClient
from config import Config
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId

client = MongoClient(Config.MONGODB_URI)
db = client.muchengeti

def fix_mongo_id(doc):
    if '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    return doc

def get_audit_logs(
    limit: int,
    device_mac: Optional[str],
    event_type: Optional[str],
    start_date: Optional[str],
    end_date: Optional[str]
) -> list[dict]:
    query = {}
    
    if device_mac:
        query["device_mac"] = device_mac.lower()
    
    if event_type and event_type != "all":
        query["event_type"] = event_type
    
    date_query = {}
    if start_date:
        try:
            date_query["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start date format")
    
    if end_date:
        try:
            date_query["$lt"] = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end date format")
    
    if date_query:
        query["timestamp"] = date_query
    
    logs = list(db.audit_logs.find(query).limit(limit).sort("timestamp", -1))
    return [fix_mongo_id(log) for log in logs]

def log_event(
    device_mac: str,
    event_type: str,
    ip_address: Optional[str],
    details: Optional[str],
    device_name: Optional[str] = None
) -> dict:
    event = {
        "timestamp": datetime.now(),
        "device_mac": device_mac.lower(),
        "event_type": event_type,
        "ip_address": ip_address,
        "details": details,
    }
    if device_name is not None:
        event["device_name"] = device_name
    db.audit_logs.insert_one(event)
    return {"message": "Event logged"}

def generate_audit_report(data: dict) -> BytesIO:
    """Generate PDF report of audit logs"""
    try:
        print('DEBUG: Incoming data for audit report:', data)
        logs = data.get('logs', [])
        
        # Create PDF buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        
        # PDF content
        elements = []
        styles = getSampleStyleSheet()
        
        # Add title
        elements.append(Paragraph("Network Audit Report", styles['Title']))
        
        # Add filters info if present
        if data.get('filters'):
            filters = data['filters']
            filter_text = "Filters: "
            if filters.get('device_mac'):
                filter_text += f"MAC: {filters['device_mac']} "
            if filters.get('event_type') and filters['event_type'] != 'all':
                filter_text += f"Event Type: {filters['event_type']}"
            elements.append(Paragraph(filter_text, styles['Normal']))
        
        # Create table data
        table_data = [
            ["Timestamp", "Event", "MAC Address", "IP", "Device Name", "Details"]
        ]
        
        for log in logs:
            table_data.append([
                log.get('timestamp', ''),
                log.get('event_type', '').capitalize(),
                log.get('device_mac', ''),
                log.get('ip_address', 'N/A'),
                log.get('device_name', ''),
                log.get('details', '')
            ])
        
        # Create table
        t = Table(table_data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(t)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=network-audit-report.pdf"}
        )
        
    except Exception as e:
        print('ERROR in generate_audit_report:', str(e))
        raise HTTPException(status_code=500, detail=str(e))
