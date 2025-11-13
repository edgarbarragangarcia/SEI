"use client";

import React from 'react';
import MetricsDashboard from '@/components/metrics-dashboard';
import { Header } from '@/components/header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-900/80 to-black text-white">
      <Header />
      <main className="container mx-auto pt-28 pb-12 px-4 md:px-6 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 rounded-full bg-white/5 px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-black">SS</div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-300">Visión general — métricas en tiempo real y KPIs clave</p>
            </div>
          </div>
        </div>

        <MetricsDashboard />
      </main>
    </div>
  );
}
