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
  
  // Crear puntos para la línea
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = max === min ? height / 2 : height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  // Crear puntos para el área de relleno (gradiente)
  const areaPoints = `
    0,${height}
    ${data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = max === min ? height / 2 : height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ')}
    ${width},${height}
  `;

  const fadeColor = color + '00'; // Transparent version

  return (
    <motion.svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      className="inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        <filter id={`glow-${color}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Área de relleno con gradiente */}
      <polygon 
        points={areaPoints}
        fill={`url(#gradient-${color})`}
        opacity="0.8"
      />
      
      {/* Línea principal con glow */}
      <motion.polyline 
        fill="none" 
        stroke={color} 
        strokeWidth="2.5" 
        points={points} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter={`url(#glow-${color})`}
        initial={{ strokeDashoffset: width * 2 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        strokeDasharray={width * 2}
      />
      
      {/* Puntos en los extremos */}
      <motion.circle
        cx={width}
        cy={data.length > 0 ? (max === min ? height / 2 : height - ((data[data.length - 1] - min) / (max - min)) * height) : height / 2}
        r="3"
        fill={color}
        opacity="0.7"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      />
    </motion.svg>
  );
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, color = 'green', sparkline, description }) => {
  const colorMap: Record<string, { hex: string; light: string; lighter: string }> = {
    green: { hex: '#10b981', light: '#d1fae5', lighter: '#ecfdf5' },
    red: { hex: '#ef4444', light: '#fee2e2', lighter: '#fef2f2' },
    blue: { hex: '#3b82f6', light: '#dbeafe', lighter: '#eff6ff' },
    orange: { hex: '#f97316', light: '#fed7aa', lighter: '#fff7ed' },
    teal: { hex: '#14b8a6', light: '#ccfbf1', lighter: '#f0fdfa' },
    purple: { hex: '#8b5cf6', light: '#ede9fe', lighter: '#faf5ff' },
  };

  const theme = colorMap[color];

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full">
      <Card className={cn('h-full transition-all bg-gradient-to-br from-white via-white to-gray-50 border border-gray-200/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gray-300/70') as string}>
        <div className="relative">
          {/* top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${theme.hex}, rgba(0,0,0,0))` }} />
          
          {/* left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: `linear-gradient(180deg, ${theme.hex}, rgba(0,0,0,0.1))` }} />
          
          {/* background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: theme.hex }} />
          
          <CardHeader className="pb-2 pl-6 pt-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-gray-600">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pl-6 pr-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${theme.hex}, ${theme.hex}dd)` }}>
                    {value}
                  </div>
                  {change && (
                    <div className={cn(
                      "text-sm mt-2 font-bold flex items-center gap-1",
                      change.startsWith('+') || change.startsWith('-') && !change.startsWith('-2') ? "text-green-600" : "text-red-600"
                    )}>
                      <span>{change.startsWith('+') ? '↗' : '↘'}</span>
                      {change}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Sparkline data={sparkline} color={theme.hex} />
                </div>
              </div>
              {description && (
                <div className="text-xs text-gray-500/80 border-t border-gray-200/50 pt-3 pb-2">
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
