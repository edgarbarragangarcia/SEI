"use client";

import React from 'react';
import MetricsDashboardReal from '@/components/metrics-dashboard-real';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <main className="container mx-auto pt-28 pb-12 px-4 md:px-6 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-white/80 to-white/60 border border-white/20 px-4 py-2 shadow-sm backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">SS</div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Visión general — métricas en tiempo real y KPIs clave</p>
            </div>
          </div>
        </div>

        <MetricsDashboardReal />
      </main>
    </div>
  );
}
