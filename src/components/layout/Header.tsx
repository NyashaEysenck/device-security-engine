import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-cyber-card border-b border-cyber-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-cyber-accent" />
          <h1 className="text-xl font-bold">Muchengeti ICMS</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm">
                <span className="text-cyber-accent font-medium">
                  {user.username || user.email?.split('@')[0]}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {user.role === 'admin' ? '(admin)' : '(user)'}
                </span>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-muted-foreground hover:text-cyber-foreground"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
