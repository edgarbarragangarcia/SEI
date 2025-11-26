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
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
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
  const colorMap: Record<string, { hex: string; bg: string; glow: string }> = {
    green: { hex: '#10b981', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
    red: { hex: '#ef4444', bg: 'bg-red-500/10', glow: 'shadow-red-500/20' },
    blue: { hex: '#3b82f6', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' },
    orange: { hex: '#f97316', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' },
    teal: { hex: '#14b8a6', bg: 'bg-teal-500/10', glow: 'shadow-teal-500/20' },
    purple: { hex: '#8b5cf6', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  };

  const theme = colorMap[color];

  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full">
      <Card className={cn('h-full transition-all bg-[#0f0f23]/60 border border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/10 group') as string}>
        <div className="relative h-full">
          {/* top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-70" style={{ background: `linear-gradient(90deg, ${theme.hex}, transparent)` }} />

          {/* background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl" style={{ background: theme.hex }} />

          <CardHeader className="pb-2 pl-6 pt-5 relative z-10">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${theme.bg.replace('/10', '')}`} style={{ backgroundColor: theme.hex }}></div>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 pl-6 pr-6 pb-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {value}
                  </div>
                  {change && (
                    <div className={cn(
                      "text-xs mt-1.5 font-medium flex items-center gap-1.5",
                      change.startsWith('+') || (change.startsWith('-') && !change.startsWith('-2')) ? "text-emerald-400" : "text-red-400"
                    )}>
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold",
                        change.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      )}>
                        {change.startsWith('+') ? '↑' : '↓'} {change.replace(/^[+-]/, '')}
                      </span>
                      <span className="text-gray-500">vs mes anterior</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <div className="h-[40px] w-full -ml-1">
                  <Sparkline data={sparkline} color={theme.hex} />
                </div>
              </div>

              {description && (
                <div className="text-[11px] text-gray-500 border-t border-white/5 pt-3 mt-1">
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
