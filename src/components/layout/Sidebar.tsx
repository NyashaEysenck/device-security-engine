import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Network,
  Wifi,
  BarChart2,
  LogOut,
  Settings,
  Users,
  History
} from 'lucide-react';

const Sidebar = () => {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: BarChart2, path: '/' },
    { name: 'Network Monitor', icon: Network, path: '/network' },
    { name: 'Device Manager', icon: Wifi, path: '/devices' },
    { name: 'Security Tools', icon: Shield, path: '/security-ml' },
    { name: 'Audit Trail', icon: History, path: '/audit-trail' },
    { name: 'Security Reports', icon: Settings, path: '/security-reports' }
  ];
  
  // Add Admin page only for admin users
  const adminItems = [
    { name: 'Admin Panel', icon: Users, path: '/admin' }
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside className="w-56 h-screen bg-cyber-card border-r border-cyber-border flex flex-col">
      <div className="p-4 border-b border-cyber-border flex items-center justify-center">
        <Shield className="h-6 w-6 text-cyber-accent mr-2" />
        <span className="font-bold text-lg">MUCHENGETI ICMS</span>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`flex items-center p-2 rounded transition-colors group
                  ${isActive(item.path) 
                    ? 'bg-cyber-accent/20 text-cyber-accent' 
                    : 'hover:bg-cyber-accent/10'}`}
              >
                <item.icon className={`h-5 w-5 mr-3 
                  ${isActive(item.path) ? 'text-cyber-accent' : 'text-cyber-foreground group-hover:text-cyber-accent'}`} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          {/* Admin section - only visible to admins */}
          {isAdmin && (
            <>
              <li className="pt-4">
                <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-2 mb-2">
                  Administration
                </div>
                {adminItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className={`flex items-center p-2 rounded transition-colors group
                      ${isActive(item.path) 
                        ? 'bg-cyber-accent/20 text-cyber-accent' 
                        : 'hover:bg-cyber-accent/10'}`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 
                      ${isActive(item.path) ? 'text-cyber-accent' : 'text-cyber-foreground group-hover:text-cyber-accent'}`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-cyber-border">
        <button 
          onClick={logout}
          className="flex w-full items-center p-2 rounded hover:bg-cyber-accent/10 transition-colors"
        >
          <LogOut className="h-5 w-5 text-cyber-danger mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
