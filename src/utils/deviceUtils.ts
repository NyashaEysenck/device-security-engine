
import { Wifi, AlertTriangle, Shield, Activity } from 'lucide-react';

// Helper function to get device icon based on type
export const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'attack':
      return AlertTriangle;
    case 'monitor':
      return Shield;
    case 'control':
      return Activity;
    default:
      return Wifi;
  }
};

// Helper function to get icon styles
export const getDeviceIconStyle = (type: string) => {
  switch (type) {
    case 'attack':
      return "h-5 w-5 text-cyber-warning";
    case 'monitor':
      return "h-5 w-5 text-cyber-accent";
    case 'control':
      return "h-5 w-5 text-cyber-success";
    default:
      return "h-5 w-5 text-muted-foreground";
  }
};

// Helper function to get status class
export const getStatusClass = (status: string) => {
  return status === 'online' ? 'text-cyber-success' : 'text-cyber-danger';
};

// Empty array instead of sample devices
export const getSampleDevices = (userId: string) => {
  return [];
};
