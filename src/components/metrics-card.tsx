"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricsCardProps = {
  title: string;
  value: string;
  change?: string;
  color?: 'green' | 'red' | 'blue' | 'orange' | 'teal';
  sparkline?: number[];
};

function Sparkline({ data = [], color = '#10b981' }: { data?: number[]; color?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const width = 120;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = max === min ? height / 2 : height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, color = 'green', sparkline }) => {
  const colorMap: Record<string, string> = {
    green: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    orange: '#f59e0b',
    teal: '#14b8a6',
  };

  return (
    <motion.div whileHover={{ y: -6 }} className="w-full">
      <Card className={cn('h-full') as string}>
        <CardHeader>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">{value}</div>
              {change && (
                <div className="text-sm text-muted-foreground mt-1">{change}</div>
              )}
            </div>
            <div className="ml-4">
              <Sparkline data={sparkline} color={colorMap[color]} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricsCard;
