
import { toast } from "sonner";
import { NetworkDevice } from "./types";

// Function to simulate sending LED notification to Arduino devices
const sendArduinoLedNotification = async (hasUnauthorizedDevices: boolean) => {
  try {
    console.log(`Sending LED notification to Arduino: ${hasUnauthorizedDevices ? 'RED (Unauthorized)' : 'GREEN (Secure)'}`);
    // In a real implementation, this would send a command to Arduino devices
    return true;
  } catch (error) {
    console.error('Error sending LED notification:', error);
    return false;
  }
};

export const fetchNetworkDevices = async (userId: string): Promise<NetworkDevice[]> => {
  try {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.log("Provided userId is not in valid UUID format:", userId);
      return [];
    }
    
    // Return empty array instead of mock devices
    const devices: NetworkDevice[] = [];
    
    // Check if there are unauthorized devices and send Arduino notification
    const hasUnauthorizedDevices = devices.some(device => device.isAuthorized === false);
    await sendArduinoLedNotification(hasUnauthorizedDevices);
    
    return devices;
  } catch (error) {
    console.error('Error fetching network devices:', error);
    return [];
  }
};

export const simulateNetworkScan = async (user: { id: string }) => {
  try {
    if (!user.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)) {
      console.log("Provided userId is not in valid UUID format:", user.id);
      toast.error("Unable to scan network: User ID is invalid");
      return [];
    }
    
    toast.info("Network scan complete. No devices found.");
    
    // Send green notification to Arduino (no unauthorized devices)
    await sendArduinoLedNotification(false);
    
    return [];
  } catch (error) {
    console.error("Error during network scan:", error);
    toast.error("Network scan failed");
    return [];
  }
};

export const getNetworkStatus = async (userId: string) => {
  try {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.log("Provided userId is not in valid UUID format:", userId);
      return { secure: true, connectedDevices: 0, unauthorizedDevices: 0 };
    }
    
    // Return empty status
    const status = {
      secure: true,
      connectedDevices: 0,
      unauthorizedDevices: 0
    };
    
    // Send appropriate LED notification based on network status
    await sendArduinoLedNotification(status.unauthorizedDevices > 0);
    
    return status;
  } catch (error) {
    console.error('Error getting network status:', error);
    return { secure: true, connectedDevices: 0, unauthorizedDevices: 0 };
  }
};
