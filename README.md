# Device Security Engine

A comprehensive network security monitoring system that combines AI-powered threat detection with real-time device management and visual hardware alerts.

## What It Solves

**The Problem:** Home and small business networks are vulnerable to cyber threats, malicious links, phishing emails, and unauthorized device access - but users lack visibility and real-time alerts.

**The Solution:** Device Security Engine provides automated security analysis, continuous network monitoring, and instant visual alerts through Arduino hardware integration.

## Key Features

### Smart Security Analysis
- AI-powered URL scanning for malicious content detection
- Email phishing detection with confidence scoring
- Real-time threat assessment and classification

### Network Protection
- Automatic device discovery and network scanning
- Unauthorized device detection and alerts
- Device authorization management
- Security status monitoring

### Visual Alert System
- Arduino LED integration for instant security feedback
- Green LED: Network secure, all devices authorized
- Red LED: Security alert, unauthorized devices detected
- Real-time hardware status updates

### Security Intelligence
- Comprehensive audit logging of all security events
- Detailed security reports and analytics
- Admin dashboard for threat management
- Export capabilities for compliance and analysis

### Access Control
- Secure user authentication with JWT tokens
- Role-based permissions (admin/user access levels)
- Protected API endpoints and data access

## Quick Start

### Requirements
- Python 3.9+
- Node.js
- MongoDB
- Arduino Uno
- Arduino IDE

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd device-security-engine
   ```

2. **Arduino Setup**
   - Open `arduino/led_control.ino` in Arduino IDE
   - Connect Arduino Uno to computer
   - Upload sketch (Green LED → Pin 12, Red LED → Pin 13)

3. **Backend Installation**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

4. **Frontend Build**
   ```bash
   cd ..
   npm install
   npm run build
   ```

5. **Launch Application**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

6. **Access Dashboard**
   - Open http://localhost:8000
   - Register account or login
   - Connect Arduino from settings page
   - Start monitoring your network

## How It Works

1. **Monitor:** Continuously scans network for connected devices
2. **Analyze:** Uses AI to assess URLs, emails, and network activity
3. **Alert:** Triggers LED indicators when threats are detected
4. **Report:** Logs all activities for security audit trails
5. **Manage:** Provides dashboard control over device authorization

## System Architecture

- **Backend:** FastAPI (Python) - Security APIs and network monitoring
- **Frontend:** React - User dashboard and management interface  
- **Database:** MongoDB - Persistent storage for users, devices, reports
- **Hardware:** Arduino - Visual security status indicators

## Troubleshooting

- **Arduino not detected:** Install drivers, check port selection
- **Frontend not loading:** Run `npm run build` before starting backend
- **Database connection:** Verify MongoDB connection string in `.env`

---

**Device Security Engine** - Protecting networks through intelligent monitoring and instant visual alerts.
