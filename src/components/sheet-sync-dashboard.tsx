"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-4">Dashboard de Pacientes</h1>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.length}</p>
            </CardContent>
          </Card>
          <Card className="flex-grow flex flex-col bg-gradient-to-br from-rose-50/60 to-teal-50/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-md">Distribución por Sucursal</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sucursalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {sucursalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-2 flex flex-col bg-gradient-to-br from-rose-50/60 to-teal-50/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-md">Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
