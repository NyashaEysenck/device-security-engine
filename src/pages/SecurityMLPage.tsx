
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import MaliciousUrlDetector from '@/components/security/MaliciousUrlDetector';
import PhishingDetector from '@/components/security/PhishingDetector';

const SecurityMLPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Tools</h1>
        <p className="text-muted-foreground">ML-powered security analysis tools</p>
      </div>
      
      <Card className="bg-cyber-card border-cyber-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Shield className="h-5 w-5 text-cyber-accent mr-2" />
            Security Analysis Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            These tools help identify potential security threats:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Malicious URL Detection - Scans URLs for potential threats</li>
            <li>Phishing Email Detection - Analyzes email content for phishing attempts</li>
          </ul>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Malicious URL Detection</TabsTrigger>
          <TabsTrigger value="phishing">Phishing Detection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <MaliciousUrlDetector />
        </TabsContent>
        
        <TabsContent value="phishing">
          <PhishingDetector />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMLPage;
