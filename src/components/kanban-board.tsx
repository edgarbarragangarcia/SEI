"use client";

import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { Header } from "@/components/header";
import { ScheduleAppointmentModal } from "./schedule-appointment-modal";

const ItemTypes = {
  CARD: 'card',
};

const states = ["ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

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
      className={`p-4 mb-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <h4 className="font-bold">{`${patient.nombre} ${patient.apellidop} ${patient.apellidom}`}</h4>
      <p className="text-sm text-gray-600">{patient.email}</p>
      <p className="text-sm text-gray-800">{patient.nhcdefinitivo}</p>
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
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/5 p-4 bg-white rounded-lg ${isOver ? 'bg-gray-50' : ''}`}>
      <h3 className="font-bold mb-4 text-center">{state}</h3>
      {patients.map((patient, index) => (
        <Card key={index} patient={patient} />
      ))}
    </div>
  );
};

export default function KanbanBoard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      fetch('/api/sheets')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 1) {
            const headers = data[0].map((h: string) => h ? h.trim().toLowerCase() : '');
            const rows = data.slice(1).map((row: any, index: number) => {
              const rowData: Record<string, any> = { originalIndex: index + 2 };
              headers.forEach((header: string, i: number) => {
                rowData[header] = row[i];
              });
              return rowData;
            });

            const user = session?.user;
            if (!user) {
              setPatients([]);
              setIsLoading(false);
              return;
            }

            const sucursalHeader = 'sucursal';
            let filteredRows = rows;
            if (user.email === 'eabarragang@ingenes.com') {
              filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === 'monterrey');
            } else if (user.role !== 'Admin' && user.sucursal) {
              filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === user.sucursal?.toLowerCase());
            }
            
            setPatients(filteredRows);
          } else {
            setPatients([]);
          }
        })
        .catch(() => {
          toast({ title: 'Error', description: 'No se pudieron cargar los datos.', variant: 'destructive' });
          setPatients([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session, toast]);

  const handleDrop = async (patient: any, newState: string) => {
    try {
      // Si el estado nuevo es "ATENDIDA" y el estado anterior es "PROSPECTO"
      if (newState === "ATENDIDA" && patient.estado === "PROSPECTO") {
        setSelectedPatients([patient]);
        setIsScheduleModalOpen(true);
        return; // Esperamos a que el usuario complete el formulario
      }

      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowIndex: patient.originalIndex,
          header: 'estado',
          value: newState,
        }),
      });

      if (!response.ok) {
        throw new Error('El servidor respondió con un error');
      }

      toast({ title: 'Éxito', description: 'El estado del paciente ha sido actualizado.' });
      // Removemos el paciente del estado actual
      setPatients(prev => prev.filter(p => p.originalIndex !== patient.originalIndex));
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el estado del paciente.', variant: 'destructive' });
    }
  };

  const handleScheduleAppointment = async (appointmentData: { date: Date; time: string; message: string }) => {
    try {
      // 1. Actualizar el estado en Google Sheets
      const updateStatePromises = selectedPatients.map(patient =>
        fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rowIndex: patient.originalIndex,
            header: 'estado',
            value: 'ATENDIDA',
          }),
        })
      );

      // 2. Crear evento en Google Calendar
      const calendarPromise = fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `Cita: ${selectedPatients.map(p => `${p.nombre} ${p.apellidop}`).join(', ')}`,
          description: appointmentData.message,
          start: {
            dateTime: `${appointmentData.date.toISOString().split('T')[0]}T${appointmentData.time}:00`,
            timeZone: 'America/Mexico_City',
          },
          end: {
            dateTime: `${appointmentData.date.toISOString().split('T')[0]}T${
              appointmentData.time.split(':')[0]}:${
              (parseInt(appointmentData.time.split(':')[1]) + 30).toString().padStart(2, '0')}:00`,
            timeZone: 'America/Mexico_City',
          },
          attendees: selectedPatients.map(p => ({ email: p.email })),
        }),
      });

      await Promise.all([...updateStatePromises, calendarPromise]);

      // Removemos los pacientes seleccionados del estado actual
      setPatients(prev => prev.filter(p => 
        !selectedPatients.some(sp => sp.originalIndex === p.originalIndex)
      ));

      toast({ 
        title: 'Éxito', 
        description: 'La cita ha sido programada y los pacientes han sido notificados.' 
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo programar la cita. Por favor intente de nuevo.', 
        variant: 'destructive' 
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 4rem)'}}>
            <p>Cargando datos...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <DndProvider backend={HTML5Backend}>
        <div className="flex p-4 space-x-4 bg-gray-50" style={{height: 'calc(100vh - 4rem)'}}>
          {states.map(state => (
            <Column
              key={state}
              state={state}
              patients={patients.filter(p => p.estado && p.estado.trim().toUpperCase() === state)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </DndProvider>

      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        patients={selectedPatients}
        onSchedule={handleScheduleAppointment}
      />
    </>
  );
}
