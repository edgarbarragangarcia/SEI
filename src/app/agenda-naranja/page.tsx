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
      className={`group p-3 bg-white rounded-xl shadow-sm border h-auto min-h-[8rem] flex flex-col 
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : 'opacity-100'} 
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5'}
        transition-all duration-200 cursor-pointer`}
      onClick={() => onSelect(patient)}
    >
      <div className="mb-2 pb-2 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[12px] leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {formattedName}
          </h4>
          {/* Language badge */}
          {(() => {
            const rawLang = (patient.IDIOMA || patient.idioma || patient.LENGUAJE || patient.LANGUAGE || '')?.toString() || '';
            const t = rawLang.toLowerCase();
            const badge = t.includes('es') || t.includes('esp') || t.includes('españ') || t.includes('spanish') ? 'ES' : (t.includes('en') || t.includes('eng') || t.includes('ingl') || t.includes('english') ? 'EN' : '');
            return badge ? (
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{badge}</span>
            ) : null;
          })()}
        </div>
        <div className="relative">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(patient);
            }}
            className="h-4 w-4 rounded-md border-gray-300 text-blue-600 
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
              checked:bg-blue-500 checked:border-transparent"
          />
          {isSelected && (
            <svg
              className="w-2 h-2 absolute -top-1 -right-1 text-blue-500 fill-current"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>
          )}
        </div>
      </div>
      <div className="text-[11px] space-y-2 flex-grow overflow-hidden">
        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-2">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">NHC:</span>
          </div>
          <span className="text-[11px] font-mono truncate text-blue-600 font-semibold">{patient.NHCDEFINITIVO}</span>

          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">Suc:</span>
          </div>
          <span className="text-[11px] truncate">{patient.SUCURSAL}</span>

          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">Tel:</span>
          </div>
          <span className="text-[11px] truncate hover:text-blue-600 transition-colors duration-200">{patient.TELEFONO}</span>

          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">FV:</span>
          </div>
          <span className="text-[11px] truncate text-orange-600">{patient.FV}</span>

          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">Conc:</span>
          </div>
          <span className="text-[11px] truncate">{patient.CONCEPTO}</span>

          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-bold text-[11px] whitespace-nowrap text-gray-600">@:</span>
          </div>
          <span className="text-[11px] truncate text-blue-600 hover:text-blue-800 transition-colors duration-200">{patient.EMAIL}</span>
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
  // Count selected patients for this column case-insensitively so states from the sheet
  // (which may be uppercase) still match the column name.
  const selectedCount = selectedPatients.filter(p => p.ESTADO && p.ESTADO.toUpperCase() === state.toUpperCase()).length;

  return (
    <div 
      ref={drop as unknown as React.Ref<HTMLDivElement>} 
      className={`w-1/6 min-w-0 p-4 rounded-2xl shadow-lg border ${colorClass} flex flex-col 
        ${isOver ? 'ring-2 ring-blue-400 shadow-xl scale-[1.02] transition-transform duration-200' : 'transition-transform duration-200'}
        backdrop-blur-sm bg-white/50`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-center mb-2">
          <h3 className="font-bold text-center text-md uppercase tracking-wider text-gray-700 flex-shrink-0 bg-white px-4 py-1 rounded-full shadow-sm">
            {state} ({patients.length})
          </h3>
        </div>
        {selectedCount > 0 && (
          <div className="mt-3 flex flex-col gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
            <div className="text-xs text-center text-blue-700 font-medium">
              {selectedCount} paciente{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </div>
            <select 
              className="w-full text-sm p-2 rounded-lg border border-blue-200 bg-white shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
      <div className="space-y-3 overflow-y-auto flex-grow pr-1 custom-scrollbar">
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
    estado: '',
    fechaInicio: '',
    fechaFin: '',
    idioma: ''
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
      // restore selected filters (including idioma) if saved
      const savedFilters = localStorage.getItem('kanbanFilters');
      if (savedFilters) {
        try {
          setSelectedFilters(JSON.parse(savedFilters));
        } catch (e) {
          console.warn('Failed to parse saved filters', e);
        }
      }
    };

    fetchData();
    loadMessages();
  }, []);

  // persist filters when they change (debounced could be used but keep simple)
  useEffect(() => {
    try {
      localStorage.setItem('kanbanFilters', JSON.stringify(selectedFilters));
    } catch (e) {
      // ignore
    }
  }, [selectedFilters]);

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
    const { sucursal, estado, fechaInicio, fechaFin, idioma } = selectedFilters;
    
    const filteredPatients = patients.filter(patient => {
      if (sucursal && patient.SUCURSAL !== sucursal) return false;
      if (estado && (!patient.ESTADO || patient.ESTADO.toUpperCase() !== estado.toUpperCase())) return false;
      
      if (fechaInicio || fechaFin) {
        const fv = new Date(patient.FV);
        if (fechaInicio && fv < new Date(fechaInicio)) return false;
        if (fechaFin && fv > new Date(fechaFin)) return false;
      }
      if (idioma) {
        const raw = (patient.IDIOMA || patient.idioma || patient.LENGUAJE || patient.LANGUAGE || '').toString().toLowerCase();
        const normalizeLang = (s: string) => {
          if (!s) return '';
          const t = s.toLowerCase();
          if (t.includes('es') || t.includes('esp') || t.includes('españ') || t.includes('spanish')) return 'es';
          if (t.includes('en') || t.includes('eng') || t.includes('ingl') || t.includes('english')) return 'en';
          return '';
        };
        const detected = normalizeLang(raw);
        if (raw && detected !== idioma) return false;
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
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100">
              <TabsList className="bg-gray-100/50 p-1 rounded-xl">
                <TabsTrigger value="kanban" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all duration-200 px-6">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="mensajes" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all duration-200 px-6">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Mensajes
                </TabsTrigger>
                <TabsTrigger value="calendario" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all duration-200 px-6">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendario
                </TabsTrigger>
              </TabsList>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  className="pl-10 pr-4 py-2 border rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <select
                className="px-4 py-2 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={selectedFilters.sucursal}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, sucursal: e.target.value }))}
              >
                <option value="">Todas las sucursales</option>
                {Array.from(new Set(patients.map(p => p.SUCURSAL))).map(sucursal => (
                  <option key={sucursal} value={sucursal}>{sucursal}</option>
                ))}
              </select>
                
                {/* Estado filter */}
                <select
                  className="px-4 py-2 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedFilters.estado}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, estado: e.target.value }))}
                >
                  <option value="">Todos los estados</option>
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {/* Language filter */}
                <select
                  className="px-4 py-2 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedFilters.idioma}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, idioma: e.target.value }))}
                >
                  <option value="">Idioma (Todos)</option>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    className="pl-10 pr-4 py-2 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedFilters.fechaInicio}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  />
                </div>
                <span className="text-gray-500">hasta</span>
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    className="pl-10 pr-4 py-2 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedFilters.fechaFin}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                variant="default"
                onClick={() => handleFilterSelection()}
                className="ml-2 rounded-xl px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Aplicar Filtros
              </Button>
              {selectedPatients.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPatients([])}
                  className="ml-auto rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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