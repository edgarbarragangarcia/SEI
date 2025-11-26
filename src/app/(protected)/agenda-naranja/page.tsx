"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ScheduleAppointmentModal } from '@/components/schedule-appointment-modal';
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from '@/store/app-store';
import {
  User,
  Building2,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Filter,
  Search,
  Settings2
} from 'lucide-react';

const ItemTypes = {
  CARD: 'card',
};

const states = ["PROSPECTO", "ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

// Helper function to get patient ID consistently
const getPatientId = (patient: any): string | number => {
  return patient.NHC || patient.NHCDEFINITIVO || patient.ID || '';
};

const KanbanCard = ({
  patient,
  isSelected,
  onSelect,
  multiSelectMode
}: {
  patient: any,
  isSelected: boolean,
  onSelect: (patient: any) => void,
  multiSelectMode: boolean
}) => {
  // Pass only serializable primitive values through drag
  // Handle both NHC and NHCDEFINITIVO field names
  const patientId = patient.NHCDEFINITIVO || patient.NHC || patient.nhc;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: {
      patientId: patientId,
      nombre: patient.NOMBRE,
      apellidop: patient.APELLIDOP,
      apellidom: patient.APELLIDOM,
      telefono: patient.TELEFONO,
      estado: patient.ESTADO,
      sucursal: patient.SUCURSAL,
      email: patient.EMAIL,
      fv: patient.FV,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [patientId, patient.NOMBRE, patient.APELLIDOP, patient.APELLIDOM, patient.TELEFONO, patient.ESTADO, patient.SUCURSAL]);

  const formattedName = `${toTitleCase(patient.NOMBRE)} ${toTitleCase(patient.APELLIDOP)} ${toTitleCase(patient.APELLIDOM)}`.trim();

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`group relative glass-card rounded-xl p-4 min-h-[10rem] flex flex-col cursor-pointer
        transition-all duration-300 ease-out animate-fadeIn
        ${isDragging ? 'opacity-40 scale-95 rotate-1' : 'opacity-100'} 
        ${isSelected
          ? 'ring-2 ring-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-purple-500/10'
          : 'hover:scale-105 hover:-translate-y-1 hover:glow-cyan'
        }`}
      onClick={() => onSelect(patient)}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

      {/* Header */}
      <div className="mb-3 pb-3 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-white/90 group-hover:text-cyan-400 transition-colors duration-200 truncate">
              {formattedName}
            </h4>
          </div>
          {/* Language badge */}
          {(() => {
            const rawLang = (patient.IDIOMA || patient.idioma || patient.LENGUAJE || patient.LANGUAGE || '')?.toString() || '';
            const t = rawLang.toLowerCase();
            const badge = t.includes('es') || t.includes('esp') || t.includes('españ') || t.includes('spanish') ? 'ES' : (t.includes('en') || t.includes('eng') || t.includes('ingl') || t.includes('english') ? 'EN' : '');
            return badge ? (
              <span className="flex-shrink-0 text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                {badge}
              </span>
            ) : null;
          })()}
        </div>
        {multiSelectMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(patient);
            }}
            aria-pressed={isSelected}
            className={`flex-shrink-0 ml-2 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200
              ${isSelected
                ? 'bg-gradient-to-br from-cyan-400 to-purple-500 border-transparent shadow-lg shadow-cyan-500/50'
                : 'bg-white/5 border-white/20 hover:border-cyan-400/50'
              }`}
            title={isSelected ? 'Deselect' : 'Select'}
          >
            {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
          </button>
        )}
      </div>

      {/* Patient Info Grid */}
      <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2.5 text-xs flex-grow">
        {/* NHC */}
        <div className="flex items-center gap-1.5 text-cyan-400/70">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">NHC:</span>
        </div>
        <span className="font-mono text-white/90 font-semibold truncate">
          {patient.NHC || patient.NHCDEFINITIVO || patient.ID || 'N/A'}
        </span>

        {/* Sucursal */}
        <div className="flex items-center gap-1.5 text-purple-400/70">
          <Building2 className="w-3.5 h-3.5" />
          <span className="font-medium">Suc:</span>
        </div>
        <span className="text-white/80 truncate">{patient.SUCURSAL}</span>

        {/* Teléfono */}
        <div className="flex items-center gap-1.5 text-green-400/70">
          <Phone className="w-3.5 h-3.5" />
          <span className="font-medium">Tel:</span>
        </div>
        <span className="text-white/80 truncate hover:text-cyan-400 transition-colors cursor-pointer">
          {patient.TELEFONO}
        </span>

        {/* Fecha Visita */}
        <div className="flex items-center gap-1.5 text-amber-400/70">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="font-medium">FV:</span>
        </div>
        <span className="text-amber-300/90 truncate font-medium">{patient.FV}</span>

        {/* Concepto */}
        <div className="flex items-center gap-1.5 text-blue-400/70">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-medium">Conc:</span>
        </div>
        <span className="text-white/80 truncate">{patient.CONCEPTO}</span>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-pink-400/70">
          <Mail className="w-3.5 h-3.5" />
          <span className="font-medium">Email:</span>
        </div>
        <span className="text-white/70 truncate text-[11px] hover:text-cyan-400 transition-colors cursor-pointer">
          {patient.EMAIL || 'N/A'}
        </span>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};



const statusColors: { [key: string]: string } = {
  PROSPECTO: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30",
  ATENDIDA: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30",
  AGENDADA: "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30",
  PENDIENTE: "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30",
  RECHAZA: "bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30",
  "NO ASISTIO": "bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/30",
  ASISTIO: "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30",
};



const Column = ({
  state,
  patients,
  onDrop,
  selectedPatients,
  onSelect,
  onMoveSelected,
  multiSelectMode
}: {
  state: string,
  patients: any[],
  onDrop: (p: any, state: string) => void,
  selectedPatients: any[],
  onSelect: (patient: any) => void,
  onMoveSelected: (targetState: string) => void,
  multiSelectMode: boolean
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: any) => {
      console.log('Drop received item:', item);
      console.log('Patient ID:', item.patientId);
      // Reconstruct patient object from drag data
      // Use both NHC and NHCDEFINITIVO for compatibility
      const patient = {
        NHCDEFINITIVO: item.patientId,
        NHC: item.patientId, // Also set NHC for compatibility
        NOMBRE: item.nombre,
        APELLIDOP: item.apellidop,
        APELLIDOM: item.apellidom,
        TELEFONO: item.telefono,
        ESTADO: item.estado,
        SUCURSAL: item.sucursal,
        EMAIL: item.email,
        FV: item.fv,
      };
      return onDrop(patient, state);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [state, onDrop]);

  const colorClass = statusColors[state] || "bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-gray-500/30";
  // Count selected patients for this column case-insensitively so states from the sheet
  // (which may be uppercase) still match the column name.
  const selectedCount = selectedPatients.filter(p => p.ESTADO && p.ESTADO.toUpperCase() === state.toUpperCase()).length;

  // Get status icon based on state
  const getStatusIcon = () => {
    switch (state.toUpperCase()) {
      case 'PROSPECTO': return <UserX className="w-4 h-4" />;
      case 'ATENDIDA': return <UserCheck className="w-4 h-4" />;
      case 'AGENDADA': return <Clock className="w-4 h-4" />;
      case 'PENDIENTE': return <AlertCircle className="w-4 h-4" />;
      case 'RECHAZA': return <XCircle className="w-4 h-4" />;
      case 'NO ASISTIO': return <XCircle className="w-4 h-4" />;
      case 'ASISTIO': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`relative min-w-[280px] flex-shrink-0 p-4 rounded-2xl border-2 flex flex-col transition-all duration-300 animate-slideUp glass-card
        ${colorClass}
        ${isOver ? 'ring-2 ring-cyan-400/70 shadow-2xl scale-105 glow-cyan' : 'hover:shadow-xl'}`}
    >
      {/* Drop Zone Indicator */}
      {isOver && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-2xl animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-center mb-3">
          <div className="glass-strong px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20">
            <div className="text-cyan-400">
              {getStatusIcon()}
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-white/90">
              {state}
            </h3>
            <div className="flex items-center justify-center min-w-[2rem] h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-2">
              <span className="text-xs font-bold text-white">
                {patients.length}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-select Panel */}
        {selectedCount > 0 && (
          <div className="mt-2 animate-scaleIn">
            <div className="glass-strong p-1.5 rounded-lg border border-cyan-400/30 flex items-center gap-2 bg-cyan-900/20">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-white shadow-sm flex-shrink-0">
                <span className="text-[10px] font-bold">{selectedCount}</span>
              </div>
              <select
                className="flex-1 text-xs py-1 px-1 rounded bg-transparent text-cyan-100 border-none focus:ring-0 cursor-pointer hover:text-white transition-colors"
                onChange={(e) => {
                  if (e.target.value) {
                    onMoveSelected(e.target.value);
                    e.target.value = '';
                  }
                }}
                value=""
              >
                <option value="" className="bg-gray-900 text-white">Mover a...</option>
                {states.filter(s => s !== state).map(s => (
                  <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Cards Container */}
      <div className="space-y-3 overflow-y-auto flex-grow pr-1 custom-scrollbar">
        {patients.map((patient, index) => (
          <KanbanCard
            key={index}
            patient={patient}
            isSelected={selectedPatients.some(p => getPatientId(p) === getPatientId(patient))}
            onSelect={onSelect}
            multiSelectMode={multiSelectMode}
          />
        ))}
      </div>
    </div>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ToastAction } from '@/components/ui/toast';

const KanbanPage = () => {
  const { data: session } = useSession();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowedBranches, setAllowedBranches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [confirmMove, setConfirmMove] = useState<{ patient: any; newState: string } | null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sucursal: '',
    estado: '',
    fechaInicio: '',
    fechaFin: '',
    idioma: ''
  });
  const { toast } = useToast();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [patientsToSchedule, setPatientsToSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-data');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setPatients(Array.isArray(result) ? result : [result]);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        toast({
          title: "Error",
          description: err.message || "Failed to fetch data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const loadStoredData = () => {
      if (typeof window === 'undefined') return;

      // Load saved messages
      try {
        const savedMessages = localStorage.getItem('kanbanMessages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          const initialMessages = states.reduce((acc, state) => ({ ...acc, [state]: '' }), {});
          setMessages(initialMessages);
        }

        // Load saved filters
        const savedFilters = localStorage.getItem('kanbanFilters');
        if (savedFilters) {
          setSelectedFilters(JSON.parse(savedFilters));
        }
      } catch (e) {
        console.warn('Failed to load saved data from localStorage', e);
      }
    };

    fetchData();
    loadStoredData();

    // fetch users sheet to determine allowed branches for current user
    const fetchAllowedBranches = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 1) {  // Skip header row
          // Find user's row (email is in column A)
          const userRow = data.find((r: string[]) => r[0] === session.user.email);
          if (userRow && userRow[3]) {  // Column D (index 3) contains branches
            const branchesStr = userRow[3].toString();
            console.log('Raw branches from sheet:', branchesStr);

            // Split and normalize all branch names
            const allowed = branchesStr
              .split(/[,;]/)  // Split on comma or semicolon
              .map((s: string) => s.trim())
              .filter(Boolean)
              .map((s: string) => {
                const branch = s.toUpperCase();
                // Normalize variations to standard names
                switch (branch) {
                  case 'AGU':
                  case 'AGUASCAL':
                    return 'AGUASCALIENTES';
                  case 'TOL':
                  case 'TOLUC':
                    return 'TOLUCA';
                  case 'CDMX':
                  case 'CD MEX':
                    return 'CIUDAD DE MEXICO';
                  case 'GDL':
                    return 'GUADALAJARA';
                  default:
                    return branch;
                }
              });

            console.log('Normalized allowed branches:', allowed);

            setAllowedBranches(allowed);

            if (typeof window !== 'undefined') {
              localStorage.setItem('allowedBranches', JSON.stringify(allowed));
            }
          }
        }
      } catch (e) {
        console.warn('Could not fetch allowed branches', e);
      }
    };

    fetchData();
    fetchAllowedBranches();
  }, [session?.user?.email]);

  // persist filters when they change (debounced could be used but keep simple)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kanbanFilters', JSON.stringify(selectedFilters));
      } catch (e) {
        console.warn('Failed to save filters to localStorage', e);
      }
    }
  }, [selectedFilters]);

  const handleMessageChange = (state: string, value: string) => {
    setMessages(prev => ({ ...prev, [state]: value }));
  };

  const saveMessages = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanbanMessages', JSON.stringify(messages));
      toast({
        title: "Mensajes guardados",
        description: "Tus mensajes se han guardado correctamente.",
      });
    }
  };

  const handleFilterSelection = () => {
    console.log('Current filters:', selectedFilters);
    console.log('Current allowed branches:', allowedBranches);
    const { sucursal, estado, fechaInicio, fechaFin, idioma } = selectedFilters;

    const filteredPatients = patients.filter(patient => {
      // Handle branch filtering
      const normalizeBranch = (branch: string): string => {
        if (!branch) return '';
        branch = branch.trim().toUpperCase();
        // Normalize common branch name variations
        const branchMappings: Record<string, string> = {
          'AGU': 'AGUASCALIENTES',
          'AGUASCAL': 'AGUASCALIENTES',
          'TOL': 'TOLUCA',
          'TOLUC': 'TOLUCA',
          'CDMX': 'CIUDAD DE MEXICO',
          'CD MEX': 'CIUDAD DE MEXICO',
          'GDL': 'GUADALAJARA'
        };
        return branchMappings[branch] || branch;
      };

      const patientBranch = normalizeBranch(patient.SUCURSAL || '');
      console.log('Processing patient branch:', patientBranch);

      // First check branch access
      let branchAllowed = false;

      // Normalize allowedBranches to be safe
      const normalizedAllowed = (allowedBranches || []).map(a => (a || '').toString().trim().toUpperCase());

      if (sucursal === 'Todas las sucursales') {
        // If the user has an explicit 'TODAS' (or similar) entry, treat as global access
        const hasAll = normalizedAllowed.some(a => a.includes('TODAS') || a === 'ALL');
        if (hasAll) {
          branchAllowed = true;
        } else {
          // Otherwise allow only the branches explicitly listed in allowedBranches
          branchAllowed = normalizedAllowed.includes(patientBranch);
        }
        console.log('Todas las sucursales check:', {
          patientBranch,
          normalizedAllowed,
          hasAll: normalizedAllowed.some(a => a.includes('TODAS') || a === 'ALL'),
          allowed: branchAllowed
        });
      } else if (sucursal) {
        // When specific branches are selected in the UI
        const selectedBranches = sucursal
          .split(',')
          .map(b => normalizeBranch(b))
          .filter(Boolean);

        // intersect selectedBranches with allowedBranches (user cannot see branches they don't have access to)
        const effectiveSelected = selectedBranches.filter(sb => normalizedAllowed.includes(sb) || normalizedAllowed.some(a => a.includes('TODAS') || a === 'ALL'));
        branchAllowed = effectiveSelected.includes(patientBranch);
        console.log('Specific branch check:', {
          patientBranch,
          selectedBranches,
          normalizedAllowed,
          effectiveSelected,
          allowed: branchAllowed
        });
      } else {
        // When no branch filter is selected, check against allowed branches
        const hasAll = normalizedAllowed.some(a => a.includes('TODAS') || a === 'ALL');
        branchAllowed = hasAll || normalizedAllowed.includes(patientBranch);
        console.log('Default branch check:', {
          patientBranch,
          normalizedAllowed,
          hasAll,
          allowed: branchAllowed
        });
      }

      if (!branchAllowed) return false;

      // Then apply other filters
      if (estado && (!patient.ESTADO || patient.ESTADO.toUpperCase() !== estado.toUpperCase())) {
        return false;
      }

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
      const isSelected = prev.some(p => getPatientId(p) === getPatientId(patient));
      if (isSelected) {
        return prev.filter(p => getPatientId(p) !== getPatientId(patient));
      } else {
        return [...prev, patient];
      }
    });
  };

  const handleMoveSelected = async (targetState: string) => {
    // Filter out patients without valid ID
    const validPatients = selectedPatients.filter(p => getPatientId(p));
    const invalidCount = selectedPatients.length - validPatients.length;

    if (invalidCount > 0) {
      console.warn(`Skipping ${invalidCount} patients without valid ID`);
      toast({
        title: 'Advertencia',
        description: `${invalidCount} paciente(s) sin identificador válido fueron omitidos`,
        variant: 'destructive',
      });
    }

    if (validPatients.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay pacientes válidos para mover',
        variant: 'destructive',
      });
      return;
    }

    const patientsToMove = validPatients.filter(p => p.ESTADO !== targetState);
    // If moving selected patients from PROSPECTO -> ATENDIDA, open scheduling modal
    const prosToAttend = patientsToMove.filter(p => (p.ESTADO || '').toString().toUpperCase() === 'PROSPECTO' && targetState.toUpperCase() === 'ATENDIDA');
    if (prosToAttend.length > 0) {
      setPatientsToSchedule(prosToAttend);
      setIsScheduleModalOpen(true);
      return;
    }

    // Store original state for rollback on error
    const originalPatients = patients;

    try {
      // 1. Actualización optimista inmediata: mostrar cambios al instante
      setPatients(prev =>
        prev.map(p =>
          patientsToMove.some(pm => getPatientId(pm) === getPatientId(p))
            ? { ...p, ESTADO: targetState }
            : p
        )
      );

      // 2. Confirmar con servidor
      const results = await Promise.all(patientsToMove.map(patient =>
        fetch('/api/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NHCDEFINITIVO: getPatientId(patient),
            ESTADO: targetState,
            NOMBRE: patient.NOMBRE,
            APELLIDOP: patient.APELLIDOP,
            APELLIDOM: patient.APELLIDOM,
            TELEFONO: patient.TELEFONO,
          }),
        }).then(async res => {
          if (!res.ok) {
            let errorMessage = 'Server error';
            try {
              const errorData = await res.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
              errorMessage = res.statusText || errorMessage;
            }
            throw new Error(errorMessage);
          }
          return res;
        })
      ));

      toast({
        title: "Pacientes movidos",
        description: `Se han movido ${patientsToMove.length} pacientes a ${targetState}`,
      });

      // Limpiar la selección
      setSelectedPatients([]);
    } catch (error) {
      console.error('Failed to move patients:', error);
      // 3. Revertir en caso de error
      setPatients(originalPatients);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron mover los pacientes';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAcceptConfirm = async () => {
    if (!confirmMove) return;
    setConfirmSaving(true);
    const patient = confirmMove.patient;
    const newState = confirmMove.newState;

    // perform update and optimistic UI
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        getPatientId(p) === getPatientId(patient) ? { ...p, ESTADO: newState } : p
      )
    );

    try {
      await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          NHCDEFINITIVO: patient.NHCDEFINITIVO,
          ESTADO: newState,
          NOMBRE: patient.NOMBRE,
          APELLIDOP: patient.APELLIDOP,
          APELLIDOM: patient.APELLIDOM,
          TELEFONO: patient.TELEFONO,
        }),
      });

      toast({ title: 'Cambio aplicado', description: `El paciente ${patient.NOMBRE} se movió a ${newState}.` });
    } catch (err) {
      console.error('Failed to update confirmed change:', err);
      toast({ title: 'Error', description: 'No se pudo guardar el cambio.', variant: 'destructive' });
    } finally {
      setConfirmSaving(false);
      setConfirmMove(null);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmMove(null);
  };

  const handleScheduleAppointment = async (appointmentData: { date: Date; time: string; message: string }) => {
    try {
      console.log('Scheduling appointment for patients:', patientsToSchedule.map(p => p.NHCDEFINITIVO));

      // 1. Actualizar el estado en Google Sheets (attempt) - do this first so UI reflects the change
      const updateStatePromises = patientsToSchedule.map(patient =>
        fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            NHCDEFINITIVO: patient.NHCDEFINITIVO,
            ESTADO: 'ATENDIDA',
            NOMBRE: patient.NOMBRE,
            APELLIDOP: patient.APELLIDOP,
            APELLIDOM: patient.APELLIDOM,
            TELEFONO: patient.TELEFONO,
          }),
        }).then(res => {
          if (!res.ok) return res.text().then(t => Promise.reject(new Error(t || res.statusText)));
          return res.json().catch(() => ({}));
        })
      );

      // Optimistically update local state so cards move to 'ATENDIDA' after submit
      setPatients(prev => prev.map(p =>
        patientsToSchedule.some(sp => sp.NHCDEFINITIVO === p.NHCDEFINITIVO)
          ? { ...p, ESTADO: 'ATENDIDA' }
          : p
      ));

      // Await sheet updates but don't block calendar creation on individual failures
      try {
        await Promise.all(updateStatePromises);
        console.log('Sheets updated for scheduled patients');
      } catch (sheetErr) {
        console.warn('One or more sheet updates failed:', sheetErr);
        toast({ title: 'Advertencia', description: 'No se pudo actualizar la hoja para algunos pacientes. Se movieron localmente.', variant: 'destructive' });
      }

      // 2. Crear evento en Google Calendar
      console.log('Creating calendar event...');
      // Build proper ISO datetimes for start and end (add 30 minutes safely)
      const [hourStr, minuteStr] = appointmentData.time.split(':');
      const hourNum = parseInt(hourStr, 10) || 0;
      const minuteNum = parseInt(minuteStr, 10) || 0;
      const startDt = new Date(appointmentData.date);
      startDt.setHours(hourNum, minuteNum, 0, 0);
      const endDt = new Date(startDt.getTime() + 30 * 60 * 1000);

      const calendarResponse = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `Cita: ${patientsToSchedule.map(p => `${p.NOMBRE} ${p.APELLIDOP}`).join(', ')}`,
          description: appointmentData.message,
          start: {
            dateTime: startDt.toISOString(),
            timeZone: 'America/Mexico_City',
          },
          end: {
            dateTime: endDt.toISOString(),
            timeZone: 'America/Mexico_City',
          },
          attendees: patientsToSchedule.map(p => ({ email: p.EMAIL })),
        }),
      });

      let calendarResult: any = {};
      try {
        calendarResult = await calendarResponse.json();
      } catch (e) {
        console.warn('Failed to parse calendar response as JSON', e);
      }

      console.log('Calendar response:', calendarResponse.status, calendarResult);

      if (!calendarResponse.ok) {
        // Show the detailed error message returned by the API when possible
        const details = calendarResult?.details || calendarResult?.error || calendarResponse.statusText;
        throw new Error(details || 'Error creating calendar event');
      }

      // Actualizar la URL del Meet en la hoja de cálculo
      console.log('Calendar result:', calendarResult);
      const meetUrl = calendarResult?.hangoutLink || calendarResult?.htmlLink;
      console.log('Meet URL to save:', meetUrl);

      if (meetUrl) {
        const updateMeetUrlPromises = patientsToSchedule.map(async patient => {
          console.log('Updating Meet URL for patient:', patient);
          try {
            const response = await fetch('/api/sheets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                NHCDEFINITIVO: patient.NHCDEFINITIVO,
                header: 'URL',
                value: meetUrl,
                sheetName: 'prueba'
              }),
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
              console.error('Failed to update sheet:', responseText);
              throw new Error(responseText || 'Failed to update sheet');
            }

            const data = responseText ? JSON.parse(responseText) : {};
            console.log('Sheet update response:', data);
            return data;
          } catch (error) {
            console.error('Sheet update error:', error);
            throw error;
          }
        });

        try {
          await Promise.all(updateMeetUrlPromises);
          console.log('Meet URLs updated in sheet for all patients');
        } catch (error) {
          console.warn('Failed to update Meet URLs in sheet:', error);
          // No lanzamos el error aquí para no interrumpir el flujo principal
        }
      }

      // Show success with Meet link if available
      toast({
        title: 'Cita Programada',
        description: calendarResult?.htmlLink
          ? 'La cita ha sido programada. Haz clic para ver el enlace de Google Meet.'
          : 'La cita ha sido programada y los pacientes han sido notificados.',
        action: calendarResult?.htmlLink ? (
          <ToastAction altText="Ver Meet" onClick={() => window.open(calendarResult.htmlLink, '_blank')}>
            Ver Meet
          </ToastAction>
        ) : undefined
      });

      setIsScheduleModalOpen(false);
      setPatientsToSchedule([]);
      // Limpiar también la selección principal
      setSelectedPatients([]);

    } catch (error: any) {
      console.error('Error al programar la cita:', error);
      // If calendar creation failed we already moved cards locally; show a descriptive toast
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo programar la cita. Por favor intente de nuevo.',
        variant: 'destructive'
      });
    }
  };

  const handleDrop = async (patient: any, newState: string) => {
    // Validate patient has required NHC/NHCDEFINITIVO field
    const patientId = patient.NHCDEFINITIVO || patient.NHC || patient.nhc;

    if (!patientId) {
      console.error('Patient object is missing NHC/NHCDEFINITIVO:', patient);
      toast({
        title: 'Error de validación',
        description: 'El paciente no tiene un identificador válido (NHC)',
        variant: 'destructive',
      });
      return;
    }

    console.log('HandleDrop - Full patient object:', patient);
    console.log('HandleDrop - Patient ID:', patientId);

    // If moving from PROSPECTO -> ATENDIDA require explicit confirmation
    const fromState = (patient.ESTADO || '').toString().toUpperCase();
    const toState = (newState || '').toString().toUpperCase();

    if (fromState === 'PROSPECTO' && toState === 'ATENDIDA') {
      // open the scheduling modal so the user can pick date/time and send message
      setPatientsToSchedule([patient]);
      setIsScheduleModalOpen(true);
      return;
    }

    // 1. Actualización optimista inmediata
    const originalPatient = patient;
    const updatedPatient = { ...patient, ESTADO: newState };
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        getPatientId(p) === getPatientId(patient) ? updatedPatient : p
      )
    );

    try {
      const response = await fetch('/api/update-status', {
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

      if (!response.ok) {
        // Get the error message from the API response
        let errorMessage = 'Server error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // 2. Toast de éxito
      toast({
        title: 'Éxito',
        description: `${patient.NOMBRE} movido a ${newState}`,
      });
    } catch (error) {
      console.error('Failed to update card status:', error);
      // 3. Revertir si hay error
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          getPatientId(p) === getPatientId(patient) ? originalPatient : p
        )
      );
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el paciente';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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

  // Enforce allowedBranches: if the logged-in user has allowed branches, filter displayed patients
  const visiblePatients = allowedBranches && allowedBranches.length > 0
    ? filteredPatients.filter(p => {
      const s = (p.SUCURSAL || '').toString().trim().toUpperCase();
      return s && allowedBranches.includes(s);
    })
    : filteredPatients;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="sr-only">Cargando datos...</span>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        patients={patientsToSchedule}
        onSchedule={handleScheduleAppointment}
      />
      <div className="p-6 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
        <Tabs defaultValue="kanban" className="flex flex-col h-full">
          <div className="flex flex-col gap-4 mb-6 flex-shrink-0">
            {/* Header with Tabs */}
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <TabsList className="glass-strong p-1.5 rounded-xl border border-white/10">
                <TabsTrigger
                  value="kanban"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 px-6 text-white/70 hover:text-white/90"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger
                  value="mensajes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 px-6 text-white/70 hover:text-white/90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Mensajes
                </TabsTrigger>
                <TabsTrigger
                  value="calendario"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 px-6 text-white/70 hover:text-white/90"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendario
                </TabsTrigger>
              </TabsList>

              {/* Search Bar */}
              <div className="relative mt-4">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/70" />
                <input
                  placeholder="Buscar paciente..."
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/20 text-white/90 placeholder-white/50
                    focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                    hover:border-cyan-400/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Filter controls moved into Kanban tab (see below) */}
          </div>
          <TabsContent value="kanban" className="flex flex-col flex-grow overflow-hidden mt-0">
            {/* Filters specific to Kanban */}
            {/* Filters */}
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="flex gap-3 items-center flex-wrap">
                <select
                  className="px-4 py-2.5 glass rounded-xl border border-white/20 text-white/90 text-sm
                    focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                    hover:border-cyan-400/50 cursor-pointer bg-white/5"
                  value={selectedFilters.sucursal}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, sucursal: e.target.value }))}
                >
                  <option value="" className="bg-gray-900">Todas las sucursales</option>
                  {allowedBranches.map(b => (
                    <option key={b} value={b} className="bg-gray-900">{b}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 glass rounded-xl border border-white/20 text-white/90 text-sm
                    focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                    hover:border-cyan-400/50 cursor-pointer bg-white/5"
                  value={selectedFilters.estado}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, estado: e.target.value }))}
                >
                  <option value="" className="bg-gray-900">Todos los estados</option>
                  {states.map(s => (
                    <option key={s} value={s} className="bg-gray-900">{s}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 glass rounded-xl border border-white/20 text-white/90 text-sm
                    focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                    hover:border-cyan-400/50 cursor-pointer bg-white/5"
                  value={selectedFilters.idioma}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, idioma: e.target.value }))}
                >
                  <option value="" className="bg-gray-900">Idioma (Todos)</option>
                  <option value="es" className="bg-gray-900">Español</option>
                  <option value="en" className="bg-gray-900">English</option>
                </select>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" />
                    <input
                      type="date"
                      className="pl-10 pr-3 py-2.5 glass rounded-xl border border-white/20 text-white/90 text-sm
                        focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                        hover:border-cyan-400/50 cursor-pointer bg-white/5"
                      value={selectedFilters.fechaInicio}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                    />
                  </div>
                  <span className="text-white/50 text-sm">hasta</span>
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" />
                    <input
                      type="date"
                      className="pl-10 pr-3 py-2.5 glass rounded-xl border border-white/20 text-white/90 text-sm
                        focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200
                        hover:border-cyan-400/50 cursor-pointer bg-white/5"
                      value={selectedFilters.fechaFin}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={() => handleFilterSelection()}
                  className="rounded-xl px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setMultiSelectMode(prev => !prev)}
                  className={"ml-2 rounded-xl px-3 py-2 transition-all " + (multiSelectMode ? 'bg-blue-50 text-blue-600' : '')}
                >
                  {multiSelectMode ? 'Selección: ON' : 'Selección: OFF'}
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

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar mt-4 h-full">
              {states.map((state) => (
                <Column
                  key={state}
                  state={state}
                  patients={visiblePatients.filter((p) => p.ESTADO && p.ESTADO.toUpperCase() === state.toUpperCase())}
                  onDrop={handleDrop}
                  selectedPatients={selectedPatients}
                  onSelect={handlePatientSelect}
                  onMoveSelected={handleMoveSelected}
                  multiSelectMode={multiSelectMode}
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
      {confirmMove && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-4">
            <div className="max-w-xs">
              <div className="font-medium">Confirmar cambio</div>
              <div className="text-sm">¿Mover a <strong>{confirmMove.newState}</strong> al paciente <strong>{toTitleCase((confirmMove.patient?.NOMBRE || '').toString())}</strong>?</div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAcceptConfirm} disabled={confirmSaving}>{confirmSaving ? 'Guardando...' : 'Aceptar'}</Button>
              <Button variant="ghost" onClick={handleCancelConfirm}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default KanbanPage;