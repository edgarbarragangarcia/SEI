"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SheetSyncDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-data');
        const result = await response.json();
        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Include PROSPECTO as a state and compare case-insensitively
  const states = ["PROSPECTO", "ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

  const statusData = states.map(status => ({
    name: status,
    count: data.filter((item: any) => (item.ESTADO || '').toString().toUpperCase() === status.toString().toUpperCase()).length,
  }));

  const sucursalData = Array.from(new Set(data.map((item: any) => item.SUCURSAL)))
    .map(sucursal => ({
      name: sucursal,
      value: data.filter((item: any) => item.SUCURSAL === sucursal).length,
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#7C3AED'];

  const ApexCharts: any = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse" /> })

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  const categories = statusData.map(s => s.name)
  const counts = statusData.map(s => s.count)
  const options = {
    chart: { id: 'status', toolbar: { show: false } },
    xaxis: { categories },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '50%', distributed: true } },
    dataLabels: { enabled: false },
    grid: { borderColor: 'rgba(0,0,0,0.06)' },
    colors: COLORS.slice(0, categories.length),
    tooltip: { theme: 'light' },
  }
  const series = [{ name: 'count', data: counts }]

  return (
    // reduce overall height so dashboard doesn't force vertical scroll on typical screens
    <div className="container mx-auto p-3 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.length}</p>
            </CardContent>
          </Card>
          <Card className="flex-grow flex flex-col bg-white">
            <CardHeader>
              <CardTitle className="text-sm">Pacientes por Estado</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="divide-y divide-gray-100">
                {statusData.map((s, idx) => {
                  const total = data.length || 1;
                  const pct = Math.round((s.count / total) * 100);
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <li key={s.name} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span aria-hidden className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs text-muted-foreground tracking-wide">{s.name}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-36 hidden sm:block">
                          <div className="h-2 rounded bg-gray-100 overflow-hidden">
                            <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{s.count}</div>
                            <div className="text-xs text-muted-foreground">{pct}%</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          {/* 'Distribución por Sucursal' card removed as requested */}
        </div>
        <Card className="col-span-2 flex flex-col bg-white">
          <CardHeader>
            <CardTitle className="text-sm">Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="w-full h-[24rem]">
              {/* reduce chart height to avoid vertical scroll; ApexChart height given in px as well */}
              <ApexCharts options={options} series={series} type="bar" height={380} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
