
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock, AlertTriangle, Shield } from 'lucide-react';

interface UnauthorizedSession {
  deviceId: string;
  deviceName: string;
  detectedTime: string; // ISO string
  authorizedTime: string | null; // ISO string or null if still unauthorized
  duration: number; // in minutes
}

// Mock data for unauthorized sessions
const unauthorizedSessions: UnauthorizedSession[] = [
  {
    deviceId: 'dev-1',
    deviceName: 'Unknown Smartphone',
    detectedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    authorizedTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
    duration: 30 // 30 minutes
  },
  {
    deviceId: 'dev-2',
    deviceName: 'Unknown Laptop',
    detectedTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    authorizedTime: new Date(Date.now() - 4.7 * 60 * 60 * 1000).toISOString(), // 4.7 hours ago
    duration: 18 // 18 minutes
  },
  {
    deviceId: 'dev-3',
    deviceName: 'Unknown IoT Device',
    detectedTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    authorizedTime: null, // Still unauthorized
    duration: 60 // 60 minutes and counting
  }
];

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const DailyStatistics = () => {
  // Calculate total counts
  const totalDetected = unauthorizedSessions.length;
  const stillUnauthorized = unauthorizedSessions.filter(session => session.authorizedTime === null).length;
  const totalDuration = unauthorizedSessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="h-5 w-5 text-cyber-accent mr-2" />
          Daily Security Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-cyber-background border border-cyber-border rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Unauthorized</span>
              <AlertTriangle className="h-4 w-4 text-cyber-warning" />
            </div>
            <p className="text-2xl font-semibold mt-1">{totalDetected}</p>
          </div>
          
          <div className="p-3 bg-cyber-background border border-cyber-border rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Still Unauthorized</span>
              <Shield className="h-4 w-4 text-cyber-danger" />
            </div>
            <p className="text-2xl font-semibold mt-1">{stillUnauthorized}</p>
          </div>
          
          <div className="p-3 bg-cyber-background border border-cyber-border rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Duration</span>
              <Clock className="h-4 w-4 text-cyber-accent" />
            </div>
            <p className="text-2xl font-semibold mt-1">{formatDuration(totalDuration)}</p>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-2">Unauthorized Device History</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {unauthorizedSessions.map((session) => (
            <div key={session.deviceId} className="flex items-center justify-between p-2 border border-cyber-border rounded text-sm">
              <div>
                <p className="font-medium">{session.deviceName}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatTime(session.detectedTime)} 
                    {session.authorizedTime 
                      ? ` to ${formatTime(session.authorizedTime)}` 
                      : ' to Present'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs px-2 py-0.5 rounded bg-cyber-background">
                  {formatDuration(session.duration)}
                </span>
                {session.authorizedTime === null && (
                  <span className="text-xs text-cyber-danger mt-1">Active</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyStatistics;
