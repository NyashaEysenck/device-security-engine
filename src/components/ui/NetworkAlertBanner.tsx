import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNetworkAlert } from "@/contexts/NetworkAlertContext";
import { Shield } from "lucide-react";

export const NetworkAlertBanner = () => {
  const { unauthorizedDevices } = useNetworkAlert();

  if (unauthorizedDevices <= 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <Shield className="h-5 w-5 mr-2 inline text-cyber-warning" />
      <AlertTitle>Unauthorized Devices Detected!</AlertTitle>
      <AlertDescription>
        There {unauthorizedDevices === 1 ? 'is' : 'are'} <b>{unauthorizedDevices}</b> unauthorized device{unauthorizedDevices === 1 ? '' : 's'} connected to your network. Please review them in the Network Monitor.
      </AlertDescription>
    </Alert>
  );
};
