import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/api/axiosInstance";

interface NetworkAlertContextType {
  unauthorizedDevices: number;
  scanning: boolean;
  refreshStatus: () => void;
}

const NetworkAlertContext = createContext<NetworkAlertContextType | undefined>(undefined);

export const NetworkAlertProvider = ({ children }: { children: ReactNode }) => {
  const [unauthorizedDevices, setUnauthorizedDevices] = useState(0);
  const [scanning, setScanning] = useState(false);

  const fetchStatus = async () => {
    try {
      // Get unauthorized device count
      const statusRes = await api.get("/network/status");
      setUnauthorizedDevices(statusRes.data.unauthorized_devices || 0);
      // Get scan status
      const scanRes = await api.get("/network/scan-status");
      setScanning(!!scanRes.data.scanning);
    } catch {
      // On error, assume no scan and no alert
      setUnauthorizedDevices(0);
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkAlertContext.Provider value={{ unauthorizedDevices, scanning, refreshStatus: fetchStatus }}>
      {children}
    </NetworkAlertContext.Provider>
  );
};

export const useNetworkAlert = () => {
  const ctx = useContext(NetworkAlertContext);
  if (!ctx) throw new Error("useNetworkAlert must be used within NetworkAlertProvider");
  return ctx;
};
