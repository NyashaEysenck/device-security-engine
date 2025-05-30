import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
// FIXED: Correct import for axios instance
import api from '@/api/axiosInstance'; 

interface AnalysisResult {
  isMalicious: boolean;
  confidence: number;
  reason?: string;
}

const MaliciousUrlDetector = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleDetectUrl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/security/analyze-url', { url });
      const data: AnalysisResult = response.data;
      setResult(data);

      if (data.isMalicious) {
        toast.error('Potentially malicious URL detected!');
      } else {
        toast.success('URL appears to be safe');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error analyzing URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Malicious URL Detector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter URL to analyze (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="cyber-input"
            />
            <Button 
              onClick={handleDetectUrl}
              disabled={loading}
              className="bg-cyber-accent hover:bg-opacity-80"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          {result && (
            <Alert variant={result.isMalicious ? "destructive" : "default"} className="mt-4">
              {result.isMalicious ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Potentially Malicious URL</AlertTitle>
                  <AlertDescription>
                    <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                    {result.reason && <div>Reason: {result.reason}</div>}
                    <div className="mt-2 text-xs">We recommend avoiding this URL. It may be attempting to steal information or install malware.</div>
                  </AlertDescription>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>URL Appears Safe</AlertTitle>
                  <AlertDescription>
                    <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                    {result.reason && (
                      <div className="mt-2 text-xs">{result.reason}</div>
                    )}
                    <div className="mt-2 text-xs">No known threats associated with this URL, but always exercise caution when clicking links.</div>
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          <div className="text-xs text-muted-foreground mt-4">
            <p>This tool uses AI to analyze URLs for potential security threats. It checks the URL structure and patterns against known threat indicators.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaliciousUrlDetector;