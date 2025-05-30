
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-background">
      <div className="w-full max-w-md px-8 animate-fadeIn">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-cyber-accent mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Muchengeti ICMS</h1>
          <p className="text-muted-foreground">IoT-Based Cybersecurity Monitoring System</p>
        </div>

        <Card className="p-6 bg-cyber-card border-cyber-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Username</label>
              </div>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="cyber-input"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Password</label>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="cyber-input"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyber-accent hover:bg-opacity-80" 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>Observer: observer / observer123</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
