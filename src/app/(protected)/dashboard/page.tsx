"use client";

import React from 'react';
import MetricsDashboardReal from '@/components/metrics-dashboard-real';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto pt-4 pb-12 px-4 md:px-6 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 rounded-full bg-white/5 border border-white/10 px-4 py-2 shadow-lg backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-cyan-500/20 shadow-lg">SS</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
              <p className="text-xs text-gray-400">Visión general — métricas en tiempo real y KPIs clave</p>
            </div>
          </div>
        </div>

        <MetricsDashboardReal />
      </main>
    </div>
  );
}
