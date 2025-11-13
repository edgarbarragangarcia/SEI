"use client";

import React from 'react';
import MetricsDashboard from '@/components/metrics-dashboard';
import { Header } from '@/components/header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 md:px-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <MetricsDashboard />
      </main>
    </div>
  );
}
