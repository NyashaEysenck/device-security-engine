
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  status: 'success' | 'warning' | 'danger';
  details: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, status, details }) => {
  const statusColors = {
    success: 'text-cyber-success',
    warning: 'text-cyber-warning',
    danger: 'text-cyber-danger',
  };
  
  return (
    <Card className="bg-cyber-card border-cyber-border overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`${statusColors[status]}`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${statusColors[status]}`}>{value}</div>
          <p className="text-xs text-muted-foreground">{details}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
