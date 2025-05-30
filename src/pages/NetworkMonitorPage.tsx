// NetworkMonitorPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wifi, Shield, RefreshCw, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkAlert } from '@/contexts/NetworkAlertContext';
import { toast } from 'sonner';
// FIXED: Correct import for axios instance
import api from '@/api/axiosInstance'; 

interface Device {
  ip: string;
  mac: string;
  authorized: boolean;
  first_seen: string;
  last_seen: string;
  name: string;
}

interface NetworkStatus {
  secure: boolean;
  connected_devices: number;
  unauthorized_devices: number;
}

const NetworkMonitorPage = () => {
  const { user } = useAuth();
  const { scanning, refreshStatus } = useNetworkAlert();
  const [devices, setDevices] = useState<Device[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    secure: true,
    connected_devices: 0,
    unauthorized_devices: 0
  });
  const [loading, setLoading] = useState(false);

  // --- Device Name Editing State ---
  const [editingDeviceMac, setEditingDeviceMac] = useState<string | null>(null);
  const [editingDeviceName, setEditingDeviceName] = useState<string>("");

  const fetchNetworkStatus = async () => {
    try {
      const response = await api.get('/network/status');
      setNetworkStatus(response.data);
    } catch (error) {
      toast.error('Failed to fetch network status');
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await api.get('/network/devices');
      setDevices(response.data);
    } catch (error) {
      toast.error('Failed to fetch devices');
    }
  };

  const toggleScan = async () => {
    setLoading(true);
    try {
      if (scanning) {
        await api.post('/network/stop-scan');
        toast.success('Scanning stopped');
      } else {
        await api.post('/network/start-scan');
        toast.success('Scanning started');
      }
      refreshStatus(); // Update global scan state
    } catch (error) {
      toast.error(`Failed to ${scanning ? 'stop' : 'start'} scanning`);
    } finally {
      setLoading(false);
    }
  };

  const authorizeDevice = async (mac: string, authorize: boolean) => {
    try {
      await api.post(`/network/devices/${mac}/authorize`, {
        authorized: authorize,
      });
      toast.success(`Device ${authorize ? 'authorized' : 'unauthorized'}`);
      fetchDevices();
      fetchNetworkStatus();
    } catch (error) {
      toast.error('Failed to update device authorization');
    }
  };

  const handleEditName = (mac: string, currentName: string) => {
    setEditingDeviceMac(mac);
    setEditingDeviceName(currentName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingDeviceName(e.target.value);
  };

  const handleSaveName = async (mac: string) => {
    try {
      await api.patch(`/network/devices/${mac}/name`, { name: editingDeviceName });
      toast.success("Device name updated");
      setEditingDeviceMac(null);
      setEditingDeviceName("");
      fetchDevices();
    } catch {
      toast.error("Failed to update device name");
    }
  };

  const handleCancelEdit = () => {
    setEditingDeviceMac(null);
    setEditingDeviceName("");
  };

  // Initial load and polling
  useEffect(() => {
    if (!user) return;

    fetchNetworkStatus();
    fetchDevices();

    const interval = setInterval(() => {
      fetchNetworkStatus();
      fetchDevices();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Network Monitor</h1>
        <p className="text-muted-foreground">Monitor and manage devices on your network</p>
      </div>
      
      {!user ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4">
              Please log in to access network monitoring
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-cyber-card border-cyber-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-cyber-accent mr-2" />
                  Network Status
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={toggleScan}
                    disabled={loading}
                    variant={scanning ? "destructive" : "default"}
                    className="flex items-center"
                  >
                    {scanning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Stop Scan
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Start Scan
                      </>
                    )}
                  </Button>
                  {networkStatus.secure ? (
                    <Badge className="bg-cyber-success">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-cyber-warning/10 text-cyber-warning border-cyber-warning">
                      <Shield className="h-3 w-3 mr-1" />
                      Warning
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="p-2 bg-cyber-background border border-cyber-border rounded">
                  <p className="text-sm text-muted-foreground">Connected Devices</p>
                  <p className="text-2xl font-semibold text-cyber-accent">
                    {networkStatus.connected_devices}
                  </p>
                </div>
                <div className="p-2 bg-cyber-background border border-cyber-border rounded">
                  <p className="text-sm text-muted-foreground">Unauthorized Devices</p>
                  <p className={`text-2xl font-semibold ${
                    networkStatus.unauthorized_devices > 0 ? 'text-cyber-warning' : 'text-cyber-success'
                  }`}>
                    {networkStatus.unauthorized_devices}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>First Seen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.mac}>
                      <TableCell>
                        {editingDeviceMac === device.mac ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingDeviceName}
                              onChange={handleNameChange}
                              className="border rounded px-2 py-1 text-sm bg-cyber-background text-cyber-foreground focus:outline-none focus:ring-2 focus:ring-cyber-accent"
                              style={{ minWidth: 80 }}
                            />
                            <Button size="sm" variant="default" onClick={() => handleSaveName(device.mac)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{device.name}</span>
                            <Button size="sm" variant="outline" onClick={() => handleEditName(device.mac, device.name)}>
                              Edit
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{device.ip}</TableCell>
                      <TableCell>{device.mac}</TableCell>
                      <TableCell>
                        {new Date(device.first_seen).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={device.authorized ? "default" : "destructive"}
                          className={device.authorized ? "bg-cyber-success" : ""}
                        >
                          {device.authorized ? "Authorized" : "Unauthorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {device.authorized ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => authorizeDevice(device.mac, false)}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => authorizeDevice(device.mac, true)}
                          >
                            Authorize
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NetworkMonitorPage;