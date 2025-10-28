"use client";

import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const ItemTypes = {
  CARD: 'card',
};

const states = ["ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

const Card = ({ patient, onDrop }: { patient: any, onDrop: (p: any, state: string) => void }) => {
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
      className={`p-4 mb-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <h4 className="font-bold">{`${patient.Nombre} ${patient.ApellidoP} ${patient.ApellidoM}`}</h4>
      <p className="text-sm text-gray-600">{patient.pac_email}</p>
      <p className="text-sm text-gray-800">{patient.NHCDefinitivo}</p>
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
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/5 p-4 bg-gray-100 rounded-lg ${isOver ? 'bg-gray-200' : ''}`}>
      <h3 className="font-bold mb-4 text-center">{state}</h3>
      {patients.map((patient, index) => (
        <Card key={index} patient={patient} onDrop={onDrop} />
      ))}
    </div>
  );
};

export default function KanbanPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const fetchData = () => {
    setIsLoading(true);
    fetch('/api/sheets')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 1) {
          const headers = data[0];
          const rows = data.slice(1).map((row: any, index: number) => {
            const rowData: Record<string, any> = { originalIndex: index + 2 };
            headers.forEach((header: string, i: number) => {
              rowData[header] = row[i];
            });
            return rowData;
          });
          setPatients(rows);
        } else {
          setPatients([]);
        }
      })
      .catch(() => {
        toast({ title: 'Error', description: 'No se pudieron cargar los datos.', variant: 'destructive' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const handleDrop = async (patient: any, newState: string) => {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowIndex: patient.originalIndex,
          header: 'ESTADO',
          value: newState,
        }),
      });

      if (!response.ok) {
        throw new Error('El servidor respondió con un error');
      }

      toast({ title: 'Éxito', description: 'El estado del paciente ha sido actualizado.' });
      fetchData(); // Recargar los datos para mostrar el cambio
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el estado del paciente.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Cargando datos...</p>
        </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen p-4 space-x-4 bg-gray-50">
        {states.map(state => (
          <Column
            key={state}
            state={state}
            patients={patients.filter(p => p.ESTADO === state)}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </DndProvider>
  );
}