"use client";

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const states = ["PROSPECTO", "ATENDIDA", "Agendada", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const KanbanCard = ({ 
  patient, 
  isSelected, 
  onSelect 
}: { 
  patient: any, 
  isSelected: boolean,
  onSelect: (patient: any) => void 
}) => {
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
      className={`p-2 mb-3 bg-white rounded-lg shadow-sm border h-auto min-h-[8rem] flex flex-col ${isDragging ? 'opacity-50' : 'opacity-100'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(patient)}
    >
      <div className="mb-1 pb-1 border-b flex justify-between items-center">
        <h4 className="font-semibold text-xs leading-tight">{formattedName}</h4>
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(patient);
          }}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
      </div>
      <div className="text-xs space-y-1 flex-grow overflow-hidden">
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">NHC:</span>
          <span className="text-xs font-mono truncate">{patient.NHCDEFINITIVO}</span>
        </div>
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">Suc:</span>
          <span className="text-xs truncate">{patient.SUCURSAL}</span>
        </div>
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">Tel:</span>
          <span className="text-xs truncate">{patient.TELEFONO}</span>
        </div>
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">FV:</span>
          <span className="text-xs truncate">{patient.FV}</span>
        </div>
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">Conc:</span>
          <span className="text-xs truncate">{patient.CONCEPTO}</span>
        </div>
        <div className="flex gap-1 items-start">
          <span className="font-bold text-xs whitespace-nowrap">@:</span>
          <span className="text-xs truncate">{patient.EMAIL}</span>
        </div>
      </div>
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
  PROSPECTO: "bg-violet-50 border-violet-200",
};

const Column = ({ 
  state, 
  patients, 
  onDrop,
  selectedPatients,
  onSelect,
  onMoveSelected
}: { 
  state: string, 
  patients: any[], 
  onDrop: (p: any, state: string) => void,
  selectedPatients: any[],
  onSelect: (patient: any) => void,
  onMoveSelected: (targetState: string) => void
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { patient: any }) => onDrop(item.patient, state),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const colorClass = statusColors[state] || "bg-gray-50 border-gray-200";
  const selectedCount = selectedPatients.filter(p => p.ESTADO === state).length;

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/6 min-w-0 p-4 rounded-xl shadow-md border ${colorClass} flex flex-col ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="mb-4">
        <h3 className="font-bold text-center text-md uppercase tracking-wider text-gray-600 flex-shrink-0">
          {state} ({patients.length})
        </h3>
        {selectedCount > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="text-xs text-center text-gray-600">
              {selectedCount} paciente{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </div>
            <select 
              className="w-full text-xs p-1 rounded border"
              onChange={(e) => {
                if (e.target.value) {
                  onMoveSelected(e.target.value);
                  e.target.value = '';
                }
              }}
              value=""
            >
              <option value="">Mover a...</option>
              {states.filter(s => s !== state).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="space-y-2 overflow-y-auto flex-grow">
        {patients.map((patient, index) => (
          <KanbanCard 
            key={index} 
            patient={patient}
            isSelected={selectedPatients.some(p => p.NHCDEFINITIVO === patient.NHCDEFINITIVO)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const KanbanPage = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    sucursal: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const { toast } = useToast();

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

    const loadMessages = () => {
      const savedMessages = localStorage.getItem('kanbanMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with empty strings if nothing is saved
        const initialMessages = states.reduce((acc, state) => ({ ...acc, [state]: '' }), {});
        setMessages(initialMessages);
      }
    };

    fetchData();
    loadMessages();
  }, []);

  const handleMessageChange = (state: string, value: string) => {
    setMessages(prev => ({ ...prev, [state]: value }));
  };

  const saveMessages = () => {
    localStorage.setItem('kanbanMessages', JSON.stringify(messages));
    toast({
      title: "Mensajes guardados",
      description: "Tus mensajes se han guardado correctamente.",
    });
  };

  const handleFilterSelection = () => {
    const { sucursal, fechaInicio, fechaFin } = selectedFilters;
    
    const filteredPatients = patients.filter(patient => {
      if (sucursal && patient.SUCURSAL !== sucursal) return false;
      
      if (fechaInicio || fechaFin) {
        const fv = new Date(patient.FV);
        if (fechaInicio && fv < new Date(fechaInicio)) return false;
        if (fechaFin && fv > new Date(fechaFin)) return false;
      }
      
      return true;
    });

    setSelectedPatients(filteredPatients);
    toast({
      title: "Pacientes seleccionados",
      description: `Se han seleccionado ${filteredPatients.length} pacientes`,
    });
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatients(prev => {
      const isSelected = prev.some(p => p.NHCDEFINITIVO === patient.NHCDEFINITIVO);
      if (isSelected) {
        return prev.filter(p => p.NHCDEFINITIVO !== patient.NHCDEFINITIVO);
      } else {
        return [...prev, patient];
      }
    });
  };

  const handleMoveSelected = async (targetState: string) => {
    const patientsToMove = selectedPatients.filter(p => p.ESTADO !== targetState);
    
    try {
      await Promise.all(patientsToMove.map(patient =>
        fetch('/api/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NHCDEFINITIVO: patient.NHCDEFINITIVO,
            ESTADO: targetState,
            NOMBRE: patient.NOMBRE,
            APELLIDOP: patient.APELLIDOP,
            APELLIDOM: patient.APELLIDOM,
            TELEFONO: patient.TELEFONO,
          }),
        })
      ));

      setPatients(prev => 
        prev.map(p => 
          selectedPatients.some(sp => sp.NHCDEFINITIVO === p.NHCDEFINITIVO)
            ? { ...p, ESTADO: targetState }
            : p
        )
      );

      toast({
        title: "Pacientes movidos",
        description: `Se han movido ${patientsToMove.length} pacientes a ${targetState}`,
      });

      setSelectedPatients([]);
    } catch (error) {
      console.error('Failed to move patients:', error);
      toast({
        title: "Error",
        description: "No se pudieron mover los pacientes",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="mensajes">Mensajes</TabsTrigger>
                <TabsTrigger value="calendario">Calendario</TabsTrigger>
              </TabsList>
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
              <select
                className="px-3 py-1.5 border rounded"
                value={selectedFilters.sucursal}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, sucursal: e.target.value }))}
              >
                <option value="">Todas las sucursales</option>
                {Array.from(new Set(patients.map(p => p.SUCURSAL))).map(sucursal => (
                  <option key={sucursal} value={sucursal}>{sucursal}</option>
                ))}
              </select>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  className="px-3 py-1.5 border rounded"
                  value={selectedFilters.fechaInicio}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                />
                <span>hasta</span>
                <input
                  type="date"
                  className="px-3 py-1.5 border rounded"
                  value={selectedFilters.fechaFin}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => handleFilterSelection()}
                className="ml-2"
              >
                Aplicar Filtros
              </Button>
              {selectedPatients.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPatients([])}
                  className="ml-auto"
                >
                  Limpiar Selección ({selectedPatients.length})
                </Button>
              )}
            </div>
          </div>
          <TabsContent value="kanban">
            <div className="flex gap-6">
              {states.map((state) => (
                <Column
                  key={state}
                  state={state}
                  patients={filteredPatients.filter((p) => p.ESTADO && p.ESTADO.toUpperCase() === state.toUpperCase())}
                  onDrop={handleDrop}
                  selectedPatients={selectedPatients}
                  onSelect={handlePatientSelect}
                  onMoveSelected={handleMoveSelected}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mensajes" className="flex-grow overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Configurar Mensajes por Estado</CardTitle>
                  <CardDescription>Define un mensaje predeterminado para cada estado del Kanban.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {states.map(state => (
                      <div key={state} className="space-y-2">
                        <label className="font-medium">{toTitleCase(state)}</label>
                        <Textarea
                          placeholder={`Escribe el mensaje para el estado "${toTitleCase(state)}"...`}
                          value={messages[state] || ''}
                          onChange={(e) => handleMessageChange(state, e.target.value)}
                          className="h-28"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button onClick={saveMessages}>Guardar Mensajes</Button>
              </CardFooter>
            </Card>
          </div>
          </TabsContent>
          <TabsContent value="calendario">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
};

export default KanbanPage;