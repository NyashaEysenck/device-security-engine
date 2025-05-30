
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

// Function to log unauthorized device session for statistics
const logUnauthorizedSession = async (deviceId: string, userId: string, action: 'detected' | 'authorized' | 'blocked') => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`Logging unauthorized session: Device ${deviceId}, User ${userId}, Action: ${action}, Time: ${timestamp}`);
    
    // In a real implementation, this would log to a database
    return true;
  } catch (error) {
    console.error('Error logging unauthorized session:', error);
    return false;
  }
};

export const authorizeDevice = async (deviceId: string, userId: string) => {
  try {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.log("Provided userId is not in valid UUID format:", userId);
      return false;
    }
    
    // Log the authorization action for statistics
    await logUnauthorizedSession(deviceId, userId, 'authorized');
    
    // Update LED status (assume all devices are now authorized)
    await sendArduinoLedNotification(false);
    
    toast.info("Device authorization not available");
    return true;
  } catch (error) {
    console.error('Error authorizing device:', error);
    return false;
  }
};

export const blockDevice = async (deviceId: string, userId: string) => {
  try {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.log("Provided userId is not in valid UUID format:", userId);
      return false;
    }
    
    // Log the block action for statistics
    await logUnauthorizedSession(deviceId, userId, 'blocked');
    
    // Update LED status (assume there might still be unauthorized devices)
    // In a real implementation, we would check if there are other unauthorized devices
    await sendArduinoLedNotification(false);
    
    toast.info("Device blocking not available");
    return true;
  } catch (error) {
    console.error('Error blocking device:', error);
    return false;
  }
};
