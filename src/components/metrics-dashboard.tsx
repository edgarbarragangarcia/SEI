"use client";

import React from 'react';
import MetricsCard from './metrics-card';

export const MetricsDashboard: React.FC = () => {
  const metrics = [
    { title: 'Total Pacientes', value: '324', change: '+12', color: 'blue', sparkline: [280, 290, 300, 305, 315, 320, 324] },
    { title: 'Citas Agendadas', value: '48', change: '+8%', color: 'green', sparkline: [35, 38, 40, 42, 45, 46, 48] },
    { title: 'Citas Pendientes', value: '15', change: '-2', color: 'orange', sparkline: [20, 18, 19, 17, 16, 16, 15] },
    { title: 'Asistencia', value: '92%', change: '+4%', color: 'green', sparkline: [85, 86, 88, 89, 90, 91, 92] },
    { title: 'No Asistieron', value: '5', change: '-1', color: 'red', sparkline: [8, 7, 7, 6, 6, 5, 5] },
    { title: 'Prospectos', value: '28', change: '+5', color: 'teal', sparkline: [20, 22, 23, 24, 25, 26, 28] },
    { title: 'Atendidos Hoy', value: '12', change: '+3', color: 'blue', sparkline: [6, 7, 8, 9, 10, 11, 12] },
    { title: 'Seguimientos', value: '45', change: '+8', color: 'purple', sparkline: [32, 35, 37, 39, 41, 43, 45] },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <MetricsCard key={i} title={m.title} value={m.value} change={m.change} color={m.color as any} sparkline={m.sparkline} />
      ))}
    </div>
  );
};

export default MetricsDashboard;
