
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Wifi, PlugZap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Muchengeti Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-cyber-accent" />
          <span className="text-sm font-medium">Welcome, {user?.email?.split('@')[0]}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-cyber-card border-cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <PlugZap className="h-5 w-5 mr-2 text-cyber-accent" />
              Arduino Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Connect and manage your Arduino device for security monitoring.</p>
            <Link to="/devices">
              <Button className="w-full bg-cyber-accent">
                Manage Device
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-cyber-card border-cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wifi className="h-5 w-5 mr-2 text-cyber-accent" />
              Network Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Monitor devices on your network and detect unauthorized connections.</p>
            <Link to="/network">
              <Button className="w-full bg-cyber-accent">
                View Network
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-cyber-card border-cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-cyber-accent" />
              Security Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">ML-powered tools to analyze URLs and emails for security threats.</p>
            <Link to="/security-ml">
              <Button className="w-full bg-cyber-accent">
                Security Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-cyber-card border-cyber-border">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Welcome to Muchengeti IoT-Based Cybersecurity Monitoring System! This platform helps you monitor and secure your network using Arduino devices.</p>
            
            <div className="space-y-2">
              <h3 className="font-medium">What you can do:</h3>
              <ul className="list-disc pl-5">
                <li>Connect to Arduino devices to enable security monitoring</li>
                <li>Scan your network for unauthorized devices</li>
                <li>Analyze suspicious URLs and emails for potential threats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
