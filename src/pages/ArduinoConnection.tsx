import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Power, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const ArduinoConnection = () => {
  const [ports, setPorts] = useState<string[]>([]);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [connectionInfo, setConnectionInfo] = useState<{ port?: string, baudRate?: number }>({});
  const [baudRate, setBaudRate] = useState('9600');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const fetchPorts = async () => {
    try {
      const res = await fetch('/arduino/ports');
      const data = await res.json();
      setPorts(data.ports);
    } catch (error) {
      toast.error('Failed to fetch serial ports');
    }
  };

  const checkStatus = async () => {
    try {
      const res = await fetch('/arduino/status');
      const data = await res.json();
      setStatus(data.status);
      if (data.status === 'connected') {
        setConnectionInfo({ port: data.port });
      }
    } catch (error) {
      setStatus('disconnected');
    }
  };

  const connect = async () => {
    setStatus('connecting');
    try {
      const res = await fetch('/arduino/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          port: connectionInfo.port,
          baud_rate: parseInt(baudRate)
        })
      });
      await checkStatus();
      toast.success('Connected to Arduino');
    } catch (error) {
      setStatus('disconnected');
      toast.error('Connection failed');
    }
  };

  const disconnect = async () => {
    try {
      await fetch('/arduino/disconnect', { method: 'POST' });
      setStatus('disconnected');
      setConnectionInfo({});
      toast('Arduino disconnected');
    } catch (error) {
      toast.error('Disconnect failed');
    }
  };

  const sendCommand = async () => {
    try {
      const res = await fetch('/arduino/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      setResponse(data.response);
      setCommand('');
    } catch (error) {
      toast.error('Command failed');
    }
  };

  useEffect(() => {
    fetchPorts();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select onValueChange={value => setConnectionInfo({ ...connectionInfo, port: value })}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Port" />
          </SelectTrigger>
          <SelectContent>
            {ports.map(port => (
              <SelectItem key={port} value={port}>{port}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={baudRate} onValueChange={setBaudRate}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Baud Rate" />
          </SelectTrigger>
          <SelectContent>
            {['9600', '19200', '38400', '57600', '115200'].map(rate => (
              <SelectItem key={rate} value={rate}>{rate}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {status === 'connected' ? (
          <Button variant="destructive" onClick={disconnect}>
            <Power className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        ) : (
          <Button onClick={connect} disabled={!connectionInfo.port || status === 'connecting'}>
            {status === 'connecting' ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Power className="h-4 w-4 mr-2" />
            )}
            {status === 'connecting' ? 'Connecting...' : 'Connect'}
          </Button>
        )}

        <Badge variant={status === 'connected' ? 'default' : 'secondary'}>
          {status.toUpperCase()}
        </Badge>
      </div>

      {status === 'connected' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter Arduino command (e.g., GREEN_ON, RED_ON)"
              className="flex-1"
            />
            <Button onClick={sendCommand}>
              <Terminal className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
          {response && (
            <div className="p-3 bg-muted rounded-md">
              <code>{response}</code>
            </div>
          )}
          <div className="p-2 mt-2 rounded bg-cyber-background border text-sm">
            <b>LED Status:</b>{' '}
            <span>
              {response.includes('GREEN_ON_ACK') ? (
                <span className="text-green-600">Green LED ON, Red LED OFF</span>
              ) : response.includes('RED_ON_ACK') ? (
                <span className="text-red-600">Red LED ON, Green LED OFF</span>
              ) : (
                <span className="text-gray-500">Unknown (send a command or perform a scan)</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArduinoConnection;