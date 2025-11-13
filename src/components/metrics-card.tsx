"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricsCardProps = {
  title: string;
  value: string;
  change?: string;
  color?: 'green' | 'red' | 'blue' | 'orange' | 'teal' | 'purple';
  sparkline?: number[];
  description?: string;
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

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, color = 'green', sparkline, description }) => {
  const colorMap: Record<string, string> = {
    green: '#00FFA3',
    red: '#FF6B6B',
    blue: '#5EEAD4',
    orange: '#FFD580',
    teal: '#7AF1D3',
    purple: '#B388FF',
  };

  const glow = (hex: string) => ({ boxShadow: `0 6px 24px ${hex}22, 0 2px 8px ${hex}19` });

  return (
    <motion.div whileHover={{ y: -6 }} className="w-full">
      <Card className={cn('h-full transition-all bg-gradient-to-br from-white/2 to-white/3 border border-white/6 backdrop-blur-md rounded-xl overflow-hidden') as string} style={glow(colorMap[color])}>
        <div className="relative">
          {/* left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: `linear-gradient(180deg, ${colorMap[color]}, rgba(0,0,0,0))` }} />
          <CardHeader className="pb-2 pl-6">
            <CardTitle className="text-sm font-semibold text-gray-100/95">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white">{value}</div>
                  {change && (
                    <div className={cn(
                      "text-sm mt-1 font-medium",
                      change.startsWith('+') ? "text-green-400" : "text-red-400"
                    )}>{change}</div>
                  )}
                </div>
                <div className="ml-4">
                  <Sparkline data={sparkline} color={colorMap[color]} />
                </div>
              </div>
              {description && (
                <div className="text-sm text-gray-300/80 border-t border-white/6 pt-3">
                  {description}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricsCard;
