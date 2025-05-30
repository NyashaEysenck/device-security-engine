import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Mail } from 'lucide-react';
import { toast } from 'sonner';
// FIXED: Correct import for axios instance
import api from '@/api/axiosInstance'; 

interface AnalysisResult {
  isPhishing: boolean;
  confidence: number;
  reasons?: string[];
}

const PhishingDetector = () => {
  const [emailContent, setEmailContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleDetectPhishing = async () => {
    if (!emailContent.trim()) {
      toast.error('Please enter email content to analyze');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/security/analyze-email', { email_text: emailContent });
      const data: AnalysisResult = response.data;
      setResult(data);

      if (data.isPhishing) {
        toast.error('Potential phishing detected!');
      } else {
        toast.success('Email appears to be legitimate');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error analyzing email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2 text-cyber-accent" />
          Phishing Email Detector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste suspicious email content here to analyze..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={6}
            className="cyber-input w-full"
          />
          
          <Button 
            onClick={handleDetectPhishing}
            disabled={loading}
            className="w-full bg-cyber-accent hover:bg-opacity-80"
          >
            {loading ? 'Analyzing...' : 'Check for Phishing'}
          </Button>

          {result && (
            <Alert variant={result.isPhishing ? "destructive" : "default"} className="mt-4">
              {result.isPhishing ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Potential Phishing Detected</AlertTitle>
                  <AlertDescription>
                    <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                    {result.reasons && (
                      <div className="mt-2">
                        <div className="font-semibold">Warning signs:</div>
                        <ul className="list-disc pl-5 mt-1 text-sm">
                          {result.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-2 text-xs">Do not respond to this email or click on any links it contains.</div>
                  </AlertDescription>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Email Appears Legitimate</AlertTitle>
                  <AlertDescription>
                    <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                    {result.reasons && (
                      <div className="mt-2 text-xs">
                        {result.reasons.join(' ')}
                      </div>
                    )}
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          <div className="text-xs text-muted-foreground mt-4">
            <p>This tool uses AI to analyze email content for phishing patterns including urgency, suspicious links, and requests for personal information.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhishingDetector;