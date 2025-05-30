
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DeviceType } from '@/types/devices';
import { getSampleDevices } from '@/utils/deviceUtils';

export const useDeviceOperations = (userId: string | undefined) => {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch devices - now returns empty array
  const fetchDevices = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      // No mock devices, just empty array
      setDevices([]);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Add device function - no longer adds sample devices
  const addSampleDevices = async () => {
    if (!userId) return;
    
    try {
      toast.info('No sample devices available');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleRefreshDevice = async (id: string) => {
    try {
      toast.info('Device refresh functionality not available');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleDeleteDevice = async (id: string) => {
    try {
      setDevices(prevDevices => prevDevices.filter(device => device.id !== id));
      toast.info('Device removed');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Load devices when component mounts
  useEffect(() => {
    if (userId) {
      fetchDevices();
    }
  }, [userId]);

  return {
    devices,
    loading,
    addSampleDevices,
    handleRefreshDevice,
    handleDeleteDevice
  };
};
