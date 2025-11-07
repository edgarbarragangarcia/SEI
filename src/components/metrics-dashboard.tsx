"use client";

import React from 'react';
import MetricsCard from './metrics-card';

export const MetricsDashboard: React.FC = () => {
  const metrics = [
    // Métricas principales de pacientes
    { 
      title: 'Total Pacientes', 
      value: '324', 
      change: '+12', 
      color: 'blue', 
      sparkline: [280, 290, 300, 305, 315, 320, 324],
      description: 'Pacientes registrados en total'
    },
    { 
      title: 'Pacientes Activos', 
      value: '156', 
      change: '+5', 
      color: 'green', 
      sparkline: [140, 143, 145, 148, 150, 153, 156],
      description: 'Pacientes en tratamiento activo'
    },
    // Métricas de citas y agenda
    { 
      title: 'Citas del Mes', 
      value: '48', 
      change: '+8%', 
      color: 'purple', 
      sparkline: [35, 38, 40, 42, 45, 46, 48],
      description: 'Total de citas programadas este mes'
    },
    { 
      title: 'Consultas Pendientes', 
      value: '15', 
      change: '-2', 
      color: 'orange', 
      sparkline: [20, 18, 19, 17, 16, 16, 15],
      description: 'Consultas por realizar'
    },
    // Métricas de eficiencia
    { 
      title: 'Tasa de Asistencia', 
      value: '92%', 
      change: '+4%', 
      color: 'green', 
      sparkline: [85, 86, 88, 89, 90, 91, 92],
      description: 'Porcentaje de asistencia a citas'
    },
    { 
      title: 'Seguimientos', 
      value: '45', 
      change: '+8', 
      color: 'blue', 
      sparkline: [32, 35, 37, 39, 41, 43, 45],
      description: 'Pacientes en seguimiento post-tratamiento'
    },
    // Métricas de crecimiento
    { 
      title: 'Nuevos Prospectos', 
      value: '28', 
      change: '+5', 
      color: 'teal', 
      sparkline: [20, 22, 23, 24, 25, 26, 28],
      description: 'Nuevos contactos esta semana'
    },
    { 
      title: 'Atendidos Hoy', 
      value: '12', 
      change: '+3', 
      color: 'purple', 
      sparkline: [6, 7, 8, 9, 10, 11, 12],
      description: 'Pacientes atendidos en el día'
    },
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
