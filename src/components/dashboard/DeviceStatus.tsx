
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock device data
const devices = [
  { id: 1, name: 'ESP8266 DoS Simulator', type: 'attack', status: 'online', ip: '192.168.1.101' },
  { id: 2, name: 'Arduino Leonardo BadUSB', type: 'attack', status: 'online', ip: '192.168.1.102' },
  { id: 3, name: 'Network Scanner Node', type: 'monitor', status: 'online', ip: '192.168.1.103' },
  { id: 4, name: 'Entry Sensor (Reed Switch)', type: 'monitor', status: 'online', ip: '192.168.1.104' },
  { id: 5, name: 'Relay Control Unit', type: 'control', status: 'online', ip: '192.168.1.105' },
  { id: 6, name: 'PIR Motion Detector', type: 'monitor', status: 'offline', ip: '192.168.1.106' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'attack':
      return <AlertTriangle className="h-4 w-4 text-cyber-warning" />;
    case 'monitor':
      return <Wifi className="h-4 w-4 text-cyber-accent" />;
    case 'control':
      return <CheckCircle className="h-4 w-4 text-cyber-success" />;
    default:
      return <Wifi className="h-4 w-4 text-cyber-accent" />;
  }
};

const DeviceStatus = () => {
  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Arduino Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className="flex items-center justify-between p-2 border-b border-cyber-border last:border-0"
            >
              <div className="flex items-center">
                {getTypeIcon(device.type)}
                <span className="ml-2">{device.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">{device.ip}</span>
                {device.status === 'online' ? (
                  <div className="flex items-center text-cyber-success">
                    <div className="w-2 h-2 rounded-full bg-cyber-success mr-1 animate-pulse"></div>
                    <span className="text-xs">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center text-cyber-danger">
                    <div className="w-2 h-2 rounded-full bg-cyber-danger mr-1"></div>
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;
