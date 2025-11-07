"use client";

import React from 'react';
import MetricsCard from './metrics-card';

export const MetricsDashboard: React.FC = () => {
  const metrics = [
    { title: 'Revenue', value: '$278,600', change: '+6.1%', color: 'green', sparkline: [10, 14, 12, 18, 22, 28, 35] },
    { title: 'New Customers', value: '162', change: '+81%', color: 'teal', sparkline: [2, 3, 4, 7, 9, 11, 14] },
    { title: 'Website Sessions', value: '301,544', change: '-2%', color: 'blue', sparkline: [50, 52, 49, 48, 50, 51, 49] },
    { title: 'Page Views', value: '20,400', change: '+3.4%', color: 'orange', sparkline: [8, 9, 10, 12, 11, 12, 14] },
    { title: 'Churn Rate', value: '4.8%', change: '+2%', color: 'red', sparkline: [5, 5.2, 4.9, 5.1, 4.8, 4.7, 4.8] },
    { title: 'Active Users', value: '27,883', change: '+12%', color: 'green', sparkline: [18, 19, 20, 22, 24, 26, 27] },
    { title: 'ARPC', value: '57%', change: '-3.4%', color: 'orange', sparkline: [55, 56, 57, 58, 57, 56, 57] },
    { title: 'Bounce Rate', value: '32%', change: '+2%', color: 'blue', sparkline: [30, 31, 32, 33, 32, 31, 32] },
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
