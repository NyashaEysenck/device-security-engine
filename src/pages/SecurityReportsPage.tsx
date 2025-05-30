import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Shield, Globe, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/api/axiosInstance';

interface SecurityToolReport {
  id: string;
  timestamp: string;
  user: string;
  tool: string;
  input_data: string;
  result: string;
  confidence: number;
  reasons?: string[];
}

const toolMeta: Record<string, { label: string; icon: JSX.Element; accent: string }> = {
  malicious_url_detector: {
    label: 'Malicious URL Detection',
    icon: <Globe className="h-5 w-5 text-cyber-accent mr-2" />, 
    accent: 'border-cyber-accent',
  },
  phishing_detector: {
    label: 'Phishing Email Detection',
    icon: <Mail className="h-5 w-5 text-cyber-accent mr-2" />, 
    accent: 'border-cyber-accent',
  },
};

const SecurityReportsPage = () => {
  const { isAdmin } = useAuth();
  
  const [reports, setReports] = useState<SecurityToolReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return; // Only fetch if admin
    api.get('/security/reports')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
 
        setReports(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Security reports error:', error); // Log for debugging
        setLoading(false);
      });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="h-16 w-16 text-cyber-accent mb-4" />
        <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You need administrator privileges to access the security reports page.
        </p>
        <Button
          onClick={() => window.history.back()}
          className="bg-cyber-accent hover:bg-opacity-80"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Tool Reports</h1>
        <p className="text-muted-foreground">Structured results and findings from automated security analysis tools.</p>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-muted-foreground">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10 text-lg text-muted-foreground">No reports found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => {
            const meta = toolMeta[report.tool] || { label: report.tool, icon: <Shield />, accent: '' };
            return (
              <Card key={report.id} className={`bg-cyber-card border-cyber-border ${meta.accent}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center">{meta.icon}<span className="font-semibold text-lg">{meta.label}</span></div>
                  <span className="text-xs text-muted-foreground">{new Date(report.timestamp).toLocaleString()}</span>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">User:</span> {report.user}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Input:</span> <span className="font-mono break-all">{report.input_data}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.result === 'malicious' || report.result === 'phishing' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">Result:</span>
                    <span className={report.result === 'malicious' || report.result === 'phishing' ? 'text-red-500' : 'text-green-500'}>
                      {report.result.charAt(0).toUpperCase() + report.result.slice(1)}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">Confidence: {(report.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {report.reasons && report.reasons.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Reasons:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {report.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SecurityReportsPage;
