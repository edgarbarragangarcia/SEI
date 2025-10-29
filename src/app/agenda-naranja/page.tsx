"use client";

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const states = ["ATENDIDA", "Agendada", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const Card = ({ patient }: { patient: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { patient },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formattedName = `${toTitleCase(patient.NOMBRE)} ${toTitleCase(patient.APELLIDOP)} ${toTitleCase(patient.APELLIDOM)}`.trim();

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`p-3 mb-3 bg-white rounded-lg shadow-sm border h-28 flex flex-col justify-center ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <h4 className="font-bold text-sm">{formattedName}</h4>
      <p className="text-xs text-gray-600">{patient.EMAIL}</p>
      <p className="text-xs text-gray-800 font-mono">{patient.NHCDEFINITIVO}</p>
    </div>
  );
};

const statusColors: { [key: string]: string } = {
  ATENDIDA: "bg-blue-50 border-blue-200",
  AGENDADA: "bg-yellow-50 border-yellow-200",
  PENDIENTE: "bg-orange-50 border-orange-200",
  RECHAZA: "bg-red-50 border-red-200",
  "NO ASISTIO": "bg-slate-100 border-slate-200",
  ASISTIO: "bg-green-50 border-green-200",
};

const Column = ({ state, patients, onDrop }: { state: string, patients: any[], onDrop: (p: any, state: string) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { patient: any }) => onDrop(item.patient, state),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const colorClass = statusColors[state] || "bg-gray-50 border-gray-200";

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/6 min-w-0 p-4 rounded-xl shadow-md border ${colorClass} ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <h3 className="font-bold mb-4 text-center text-md uppercase tracking-wider text-gray-600">{state} ({patients.length})</h3>
      <div className="space-y-2">
        {patients.map((patient, index) => (
          <Card key={index} patient={patient} />
        ))}
      </div>
    </div>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KanbanPage = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-data');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.details || 'Failed to fetch data');
        }
        setPatients(Array.isArray(result) ? result : [result]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDrop = async (patient: any, newState: string) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.NHCDEFINITIVO === patient.NHCDEFINITIVO ? { ...p, ESTADO: newState } : p
      )
    );

    try {
      await fetch('/api/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NHCDEFINITIVO: patient.NHCDEFINITIVO,
          ESTADO: newState,
          NOMBRE: patient.NOMBRE,
          APELLIDOP: patient.APELLIDOP,
          APELLIDOM: patient.APELLIDOM,
          TELEFONO: patient.TELEFONO,
        }),
      });
    } catch (error) {
      console.error('Failed to update card status:', error);
      // Optionally revert the optimistic update here
    }

    console.log(`Patient ${patient.NHCDEFINITIVO} moved to ${newState}`);
  };

  const filteredPatients = patients.filter(p => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      p.NOMBRE?.toLowerCase().includes(searchTermLower) ||
      p.APELLIDOP?.toLowerCase().includes(searchTermLower) ||
      p.APELLIDOM?.toLowerCase().includes(searchTermLower) ||
      p.EMAIL?.toLowerCase().includes(searchTermLower) ||
      p.NHCDEFINITIVO?.toString().toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading data...</p>
        </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8">
        <Tabs defaultValue="kanban">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="mensajes">Mensajes</TabsTrigger>
            </TabsList>
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TabsContent value="kanban">
            <div className="flex gap-6">
              {states.map((state) => (
                <Column
                  key={state}
                  state={state}
                  patients={filteredPatients.filter((p) => p.ESTADO && p.ESTADO === state)}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mensajes">
            <div className="flex justify-center items-center h-96">
              <p>Aquí irá la funcionalidad de mensajes.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
};

export default KanbanPage;