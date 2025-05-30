import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Wifi, WifiOff, Shield, ShieldOff, Download, Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import api from '@/api/axiosInstance'; // Import axiosInstance

interface AuditLog {
  _id: string;
  timestamp: string;
  device_mac: string;
  device_name: string;
  event_type: 'connect' | 'disconnect' | 'authorize' | 'revoke' | 'name_change';
  ip_address?: string;
  details?: string;
}

const AuditTrailPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [filters, setFilters] = useState({
    device_mac: '',
    event_type: '',
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const fetchAuditLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.device_mac) params.append('device_mac', filters.device_mac);
      if (filters.event_type && filters.event_type !== 'all') {
        params.append('event_type', filters.event_type);
      }
      if (dateRange?.from) {
        params.append('start_date', format(dateRange.from, 'yyyy-MM-dd'));
      }
      if (dateRange?.to) {
        params.append('end_date', format(dateRange.to, 'yyyy-MM-dd'));
      }
      // Use axiosInstance to send JWT
      const response = await api.get(`/network/audit?${params.toString()}`);
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (logs.length === 0) {
      toast.warning('No data to export');
      return;
    }

    // Create CSV header
    const headers = ['Timestamp', 'Event Type', 'Device MAC', 'Device Name', 'IP Address', 'Details'];
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        `"${new Date(log.timestamp).toLocaleString()}"`,
        `"${log.event_type}"`,
        `"${log.device_mac}"`,
        `"${log.device_name}"`,
        `"${log.ip_address || 'N/A'}"`,
        `"${log.details || ''}"`
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `network-audit-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('CSV report downloaded');
  };

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await api.post(
        '/network/audit/report',
        { logs, filters, dateRange },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit_logs.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const interval = setInterval(fetchAuditLogs, 30000);
    return () => clearInterval(interval);
  }, [user, filters, dateRange]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'connect': return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'disconnect': return <WifiOff className="h-4 w-4 text-gray-500" />;
      case 'authorize': return <Shield className="h-4 w-4 text-green-500" />;
      case 'revoke': return <ShieldOff className="h-4 w-4 text-red-500" />;
      case 'name_change': return <Pencil className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'connect': return 'bg-blue-50 text-blue-800';
      case 'disconnect': return 'bg-gray-50 text-gray-800';
      case 'authorize': return 'bg-green-50 text-green-800';
      case 'revoke': return 'bg-red-50 text-red-800';
      case 'name_change': return 'bg-orange-50 text-orange-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Network Audit Trail</h1>
          <p className="text-muted-foreground">Historical record of all network events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      
      {!user ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4">
              Please log in to access audit logs
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Device MAC</label>
                  <Input
                    placeholder="Filter by MAC address"
                    value={filters.device_mac}
                    onChange={(e) => setFilters({...filters, device_mac: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Event Type</label>
                  <Select
                    value={filters.event_type}
                    onValueChange={(value) => setFilters({...filters, event_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="connect">Connections</SelectItem>
                      <SelectItem value="disconnect">Disconnections</SelectItem>
                      <SelectItem value="authorize">Authorizations</SelectItem>
                      <SelectItem value="revoke">Revocations</SelectItem>
                      <SelectItem value="name_change">Device Name Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchAuditLogs} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Device MAC</TableHead>
                    <TableHead>Device Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading events...
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center px-3 py-1 rounded-full ${getEventColor(log.event_type)}`}>
                            {getEventIcon(log.event_type)}
                            <span className="ml-2 capitalize">{log.event_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{log.device_mac}</TableCell>
                        <TableCell>{log.device_name}</TableCell>
                        <TableCell>{log.ip_address || 'N/A'}</TableCell>
                        <TableCell>{log.details || 'No additional details'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AuditTrailPage;