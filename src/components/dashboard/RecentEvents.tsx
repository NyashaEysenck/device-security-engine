
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AlertTriangle,
  Shield,
  Wifi,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock event data
const events = [
  {
    id: 1,
    type: 'attack',
    title: 'DoS Attack Simulation',
    target: '192.168.1.150',
    timestamp: '2025-04-07 09:15:22',
    status: 'success',
    description: 'Successfully simulated DoS attack using ESP8266',
  },
  {
    id: 2,
    type: 'security',
    title: 'Intrusion Detected',
    target: 'Entry Sensor',
    timestamp: '2025-04-07 08:30:45',
    status: 'warning',
    description: 'Reed switch triggered on main entry point',
  },
  {
    id: 3,
    type: 'network',
    title: 'Device Disconnected',
    target: 'PIR Motion Detector',
    timestamp: '2025-04-07 07:45:12',
    status: 'error',
    description: 'Device went offline unexpectedly',
  },
  {
    id: 4,
    type: 'attack',
    title: 'BadUSB Attack Simulation',
    target: 'Test Workstation',
    timestamp: '2025-04-06 16:22:37',
    status: 'success',
    description: 'Successfully executed notepad payload',
  },
  {
    id: 5,
    type: 'security',
    title: 'Network Scan Completed',
    target: 'Local Network',
    timestamp: '2025-04-06 15:10:03',
    status: 'success',
    description: 'Identified 12 devices on network',
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'attack':
      return <AlertTriangle className="h-4 w-4 text-cyber-warning" />;
    case 'security':
      return <Shield className="h-4 w-4 text-cyber-accent" />;
    case 'network':
      return <Wifi className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-cyber-success" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-cyber-warning" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-cyber-danger" />;
    default:
      return null;
  }
};

const RecentEvents = () => {
  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="p-3 border border-cyber-border rounded-md bg-cyber-background"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getEventIcon(event.type)}
                  <span className="ml-2 font-medium">{event.title}</span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(event.status)}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {event.description}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Target: {event.target}</span>
                <span>{event.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
