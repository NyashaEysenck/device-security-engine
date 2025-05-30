
import React from 'react';
import { Wifi, Router, Monitor, Smartphone, HardDrive, Laptop, Circle } from 'lucide-react';
import { getDeviceIcon } from '@/utils/network';
import { Badge } from "@/components/ui/badge";

const iconComponents = {
  'Router': Router,
  'Monitor': Monitor,
  'Smartphone': Smartphone,
  'Wifi': Wifi,
  'HardDrive': HardDrive,
  'Laptop': Laptop
};

interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  mac: string;
  active: boolean;
  status: string;
  firstSeen: string;
  isAuthorized?: boolean;
}

interface NetworkDeviceListProps {
  devices: NetworkDevice[];
  onDeviceClick?: (device: NetworkDevice) => void;
}

const NetworkDeviceList: React.FC<NetworkDeviceListProps> = ({ 
  devices, 
  onDeviceClick 
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {devices.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No devices detected. Click "Scan Network" to discover devices.
          </div>
        ) : (
          devices.map(device => {
            const IconComponent = iconComponents[getDeviceIcon(device.type)] || Wifi;
            
            return (
              <div 
                key={device.id} 
                className="flex items-center justify-between p-2 bg-cyber-background border border-cyber-border rounded hover:bg-cyber-background/80 cursor-pointer transition-colors"
                onClick={() => onDeviceClick && onDeviceClick(device)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <IconComponent className={`h-5 w-5 ${device.isAuthorized === false ? 'text-cyber-warning' : ''}`} />
                    {/* LED indicator */}
                    <Circle 
                      className={`absolute -top-1 -right-1 h-2 w-2 fill-current ${device.isAuthorized === false ? 'text-cyber-danger animate-pulse' : 'text-cyber-success'}`} 
                    />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm">{device.name}</div>
                    <div className="text-xs text-muted-foreground">{device.ip}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground mr-2">{device.mac}</div>
                  {device.active ? (
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
                  {device.isAuthorized === false && (
                    <Badge variant="outline" className="ml-2 text-xs bg-cyber-warning/10 text-cyber-warning border-cyber-warning">
                      Unauthorized
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NetworkDeviceList;
