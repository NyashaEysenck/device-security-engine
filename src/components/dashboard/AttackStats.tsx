
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const attackData = [
  { name: 'DoS Attacks', value: 12, color: '#ff3e3e' },
  { name: 'BadUSB Attacks', value: 8, color: '#ffd23e' },
  { name: 'Network Scans', value: 15, color: '#3eff5c' },
];

const AttackStats = () => {
  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Attack Simulation Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attackData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {attackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}
                itemStyle={{ color: '#e0e0e0' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: '#e0e0e0' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Total simulations run: 35
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackStats;
