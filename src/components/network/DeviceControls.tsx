
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Power, RefreshCw, Upload, Download, Monitor, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Empty devices array
const devices: any[] = [];

const DeviceControls = () => {
  const [selectedDevice, setSelectedDevice] = React.useState<string>('');
  const [command, setCommand] = React.useState<string>('');
  
  const handleSendCommand = () => {
    if (!command.trim()) {
      toast.error('Please enter a command');
      return;
    }
    
    toast.info('No devices available to send commands to');
  };
  
  const handlePowerToggle = (id: number) => {
    toast.info('No devices available to toggle power');
  };

  return (
    <Card className="bg-cyber-card border-cyber-border p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Arduino Command Center</h3>
          
          <div className="space-y-2">
            <Label htmlFor="device-select">Select Device</Label>
            <Select 
              value={selectedDevice} 
              onValueChange={setSelectedDevice}
            >
              <SelectTrigger id="device-select" className="cyber-input">
                <SelectValue placeholder="No devices available" />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name} ({device.port})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="command">Command</Label>
            <div className="flex space-x-2">
              <Input
                id="command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command for Arduino"
                className="cyber-input flex-1"
              />
              <Button 
                onClick={handleSendCommand}
                className="bg-cyber-accent hover:bg-opacity-80"
              >
                <Upload className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Example: SCAN, LED_ON, REPORT_STATUS</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-cyber-border text-cyber-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button variant="outline" className="border-cyber-border text-cyber-foreground">
              <Download className="h-4 w-4 mr-2" />
              Get Data
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Device Power Management</h3>
          
          <div className="space-y-2">
            {devices.length > 0 ? (
              devices.map(device => (
                <div 
                  key={device.id} 
                  className="flex items-center justify-between p-2 border border-cyber-border rounded"
                >
                  <div className="flex items-center">
                    {device.type === 'arduino' ? (
                      <Zap className="h-5 w-5 text-cyber-warning mr-2" />
                    ) : (
                      <Monitor className="h-5 w-5 text-cyber-accent mr-2" />
                    )}
                    <span>{device.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${device.enabled ? 'bg-cyber-success' : 'bg-cyber-danger'}`}></div>
                    <Switch
                      checked={device.enabled}
                      onCheckedChange={() => handlePowerToggle(device.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No devices available</div>
            )}
          </div>
          
          <Button 
            variant="destructive"
            className="w-full bg-cyber-danger hover:bg-opacity-80"
            disabled={devices.length === 0}
          >
            <Power className="h-4 w-4 mr-2" />
            Emergency Shutdown All Devices
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DeviceControls;
