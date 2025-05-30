import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Router, Monitor, Smartphone, Wifi, AlertTriangle, Check, HardDrive, Laptop } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchNetworkDevices } from '@/utils/network';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Helper function to get the icon for a device type
const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'router':
      return <Router className="h-6 w-6" />;
    case 'computer':
      return <Monitor className="h-6 w-6" />;
    case 'mobile':
      return <Smartphone className="h-6 w-6" />;
    case 'laptop':
      return <Laptop className="h-6 w-6" />;
    case 'server':
      return <HardDrive className="h-6 w-6" />;
    case 'arduino':
    case 'iot':
      return <Wifi className="h-6 w-6" />;
    default:
      return <Wifi className="h-6 w-6" />;
  }
};

// Helper function to get the color for a device status
const getStatusColor = (status: string, isAuthorized?: boolean) => {
  if (isAuthorized === false) return 'text-cyber-warning border-cyber-warning';
  return status === 'active' ? 'text-cyber-accent border-cyber-accent' : 'text-cyber-danger border-cyber-danger';
};

// Function to calculate node positions in a radial layout
const calculateNodePositions = (devices: any[], centerX: number = 50, centerY: number = 50, radius: number = 30) => {
  const router = devices.find(d => d.type === 'router');
  const otherDevices = devices.filter(d => d.type !== 'router');
  
  // Position devices in a circle around the router
  return devices.map(device => {
    if (device.type === 'router') {
      return { ...device, x: centerX, y: centerY };
    } else {
      const angle = (otherDevices.indexOf(device) / otherDevices.length) * 2 * Math.PI;
      return {
        ...device,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  });
};

const NetworkMap = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);

  useEffect(() => {
    const loadDevices = async () => {
      if (!user) return;
      
      try {
        const fetchedDevices = await fetchNetworkDevices(user.id);
        
        // If no router in the devices, add a virtual one
        if (!fetchedDevices.some(d => d.type === 'router')) {
          fetchedDevices.unshift({
            id: 'virtual-router',
            name: 'Network Router',
            type: 'router',
            ip: '192.168.1.1',
            mac: 'XX:XX:XX:XX:XX:XX',
            active: true,
            status: 'active',
            firstSeen: new Date().toISOString(),
            isAuthorized: true // Add this missing property
          });
        }
        
        const positionedDevices = calculateNodePositions(fetchedDevices);
        setDevices(positionedDevices);
      } catch (error) {
        console.error('Error loading devices for network map:', error);
      }
    };
    
    loadDevices();
  }, [user]);

  if (!user || devices.length === 0) {
    return (
      <Card className="bg-cyber-card border-cyber-border p-4">
        <div className="relative h-[400px] bg-cyber-background border border-cyber-border rounded-md flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Wifi className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No network data available</p>
            <p className="text-sm">Perform a network scan to view the network map</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-cyber-card border-cyber-border p-4">
        <div className="relative h-[500px] bg-cyber-background border border-cyber-border rounded-md overflow-hidden">
          {/* Network lines */}
          <svg className="absolute w-full h-full">
            {devices.map((device) => (
              device.type !== 'router' && (
                <line
                  key={`line-${device.id}`}
                  x1={`${devices[0].x}%`}
                  y1={`${devices[0].y}%`}
                  x2={`${device.x}%`}
                  y2={`${device.y}%`}
                  stroke={device.active ? '#2c85ff' : '#555'}
                  strokeWidth={hoveredDevice === device.id ? "2" : "1"}
                  strokeDasharray={device.isAuthorized === false ? "5,5" : undefined}
                  opacity={hoveredDevice ? (hoveredDevice === device.id ? 1 : 0.3) : 0.7}
                  className="transition-opacity duration-300"
                />
              )
            ))}
          </svg>
          
          {/* Device nodes */}
          {devices.map((device) => (
            <Tooltip key={device.id}>
              <TooltipTrigger asChild>
                <div
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 border rounded-full cursor-pointer transition-all duration-300 ${getStatusColor(device.status, device.isAuthorized)} ${hoveredDevice === device.id ? 'scale-125 z-10' : hoveredDevice ? 'opacity-50' : ''}`}
                  style={{ left: `${device.x}%`, top: `${device.y}%` }}
                  onMouseEnter={() => setHoveredDevice(device.id)}
                  onMouseLeave={() => setHoveredDevice(null)}
                >
                  {getDeviceIcon(device.type)}
                  
                  {/* Status indicator */}
                  <div className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full border border-cyber-border">
                    {device.active ? (
                      <Check className="h-3 w-3 text-cyber-success" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-cyber-danger" />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-cyber-background border-cyber-border">
                <div className="px-2 py-1">
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.ip}</p>
                  {device.mac && <p className="text-xs text-muted-foreground">{device.mac}</p>}
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full ${device.active ? 'bg-cyber-success' : 'bg-cyber-danger'} mr-1`}></div>
                    <span className="text-xs">{device.active ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {/* Device labels */}
          {devices.map((device) => (
            <div
              key={`label-${device.id}`}
              className={`absolute text-xs px-1 bg-cyber-background border border-cyber-border rounded transition-opacity duration-300 ${hoveredDevice && hoveredDevice !== device.id ? 'opacity-30' : ''}`}
              style={{ 
                left: `${device.x}%`, 
                top: `${device.y + 6}%`,
                transform: 'translateX(-50%)' 
              }}
            >
              {device.name}
            </div>
          ))}
          
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            Network map visualization - Hover over devices for more details
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default NetworkMap;
