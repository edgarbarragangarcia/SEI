"use client";

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const states = ["ATENDIDA", "Agendada", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

const Card = ({ patient }: { patient: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { patient },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`p-3 mb-3 bg-white rounded-lg shadow-sm border ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <h4 className="font-bold text-sm">{`${patient.NOMBRE} ${patient.APELLIDOP} ${patient.APELLIDOM}`}</h4>
      <p className="text-xs text-gray-600">{patient.EMAIL}</p>
      <p className="text-xs text-gray-800 font-mono">{patient.NHCDEFINITIVO}</p>
    </div>
  );
};

const Column = ({ state, patients, onDrop }: { state: string, patients: any[], onDrop: (p: any, state: string) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { patient: any }) => onDrop(item.patient, state),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`flex-1 p-4 bg-gray-100 rounded-lg ${isOver ? 'bg-blue-100' : ''}`}>
      <h3 className="font-bold mb-4 text-center text-sm uppercase tracking-wider">{state}</h3>
      <div className="space-y-2">
        {patients.map((patient, index) => (
          <Card key={index} patient={patient} />
        ))}
      </div>
    </div>
  );
};

const KanbanPage = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://n8nqa.ingenes.com:5689/webhook/getSEI');
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

  const handleDrop = (patient: any, newState: string) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.NHCDEFINITIVO === patient.NHCDEFINITIVO ? { ...p, ESTADO: newState } : p
      )
    );
    // Here you would typically send a request to your backend to update the patient's state
    console.log(`Patient ${patient.NHCDEFINITIVO} moved to ${newState}`);
  };

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
        <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
        <div className="flex gap-6">
          {states.map((state) => (
            <Column
              key={state}
              state={state}
              patients={patients.filter((p) => p.ESTADO && p.ESTADO === state)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanPage;