"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Calendar as CalendarIcon, AlignLeft, X, Sparkles, Loader, MapPin, User, Video, Menu, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Array<{ name: string; email: string; phone: string; }>;
  onSchedule: (data: {
    date: Date;
    time: string;
    message: string;
    title: string;
  }) => void;
}

export function ScheduleAppointmentModal({
  isOpen,
  onClose,
  patients,
  onSchedule,
}: ScheduleAppointmentModalProps) {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [title, setTitle] = React.useState("Consulta Médica");
  const { toast } = useToast();

  // Generar horarios disponibles de 9 AM a 6 PM
  const availableTimes = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && message) {
      onSchedule({ date, time, message, title });
      onClose();
    }
  };

  // Generar mensaje con IA
  const generateMessageWithAI = async () => {
    if (!date || !time) {
      toast({
        title: "Error",
        description: "Selecciona fecha y hora primero",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es });
      const patientNames = patients.map(p => p.name).join(", ");

      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formattedDate,
          time,
          patients: patientNames,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar mensaje');
      }

      const data = await response.json();
      setMessage(data.message);
      toast({
        title: "Éxito",
        description: "Mensaje generado con IA",
      });
    } catch (error) {
      console.error('Error generating message:', error);
      // Fallback a mensaje automático
      const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es });
      setMessage(
        `Hola, tu cita ha sido programada para el ${formattedDate} a las ${time} hrs.\n\n` +
        `Por favor confirma tu asistencia respondiendo este mensaje.\n\n` +
        `Ubicación: [Dirección de la clínica]\n` +
        `Teléfono: [Número de contacto]\n\n` +
        `Notas importantes:\n` +
        `- Por favor llega 10 minutos antes de tu cita\n` +
        `- Trae contigo una identificación oficial\n` +
        `- Si necesitas cancelar, háznoslo saber con 24 horas de anticipación`
      );
      toast({
        title: "Mensaje generado",
        description: "Mensaje automático (IA no disponible)",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Mensaje predeterminado que incluye la fecha y hora
  React.useEffect(() => {
    if (date && time && !message) {
      const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es });
      setMessage(
        `Hola, tu cita ha sido programada para el ${formattedDate} a las ${time} hrs.\n\n` +
        `Por favor confirma tu asistencia respondiendo este mensaje.\n\n` +
        `Ubicación: [Dirección de la clínica]\n` +
        `Teléfono: [Número de contacto]\n\n` +
        `Notas importantes:\n` +
        `- Por favor llega 10 minutos antes de tu cita\n` +
        `- Trae contigo una identificación oficial\n` +
        `- Si necesitas cancelar, háznoslo saber con 24 horas de anticipación`
      );
    }
  }, [date, time]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] p-0 gap-0 border-0 shadow-2xl rounded-xl bg-white overflow-hidden">
        <DialogTitle className="sr-only">Agendar Cita</DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para programar una cita médica con fecha, hora y detalles de la consulta.
        </DialogDescription>
        {/* Header - GCal style */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100/50 drag-handle cursor-move">
          <div className="flex items-center gap-4 text-gray-500">
            <Menu className="w-5 h-5 cursor-pointer hover:bg-gray-200 rounded p-0.5" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 pt-2 pb-6 space-y-4">

            {/* Title Input Area */}
            <div className="ml-[52px]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Añade un título"
                className="w-full text-[22px] leading-tight text-gray-800 placeholder:text-gray-400 border-b border-gray-200 focus:border-blue-600 focus:outline-none pb-1 transition-colors bg-transparent"
              />
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md cursor-pointer">Evento</span>
                <span className="px-3 py-1 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-md cursor-pointer">Tarea</span>
                <span className="px-3 py-1 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-md cursor-pointer">Fuera de la oficina</span>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="flex gap-5 items-start group">
              <div className="mt-1 text-gray-500 w-8 flex justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {/* Date Picker Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "justify-start text-left font-normal h-8 px-2 hover:bg-gray-100 rounded text-gray-700",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "EEEE, d 'de' MMMM", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time Select */}
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-[100px] border-0 bg-transparent hover:bg-gray-100 focus:ring-0 h-8 px-2 text-gray-700 shadow-none data-[placeholder]:text-gray-700">
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span>–</span>

                  {/* End Time (Calculated visually) */}
                  <span className="text-gray-700 px-2">
                    {time ? (() => {
                      const [h, m] = time.split(':').map(Number);
                      const endDate = new Date();
                      endDate.setHours(h, m + 30);
                      return format(endDate, 'HH:mm');
                    })() : 'Hora'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 px-2">
                  Zona horaria: Hora estándar de Colombia
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-5 items-center group">
              <div className="text-gray-500 w-8 flex justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Añadir ubicación"
                className="flex-1 text-sm text-gray-700 placeholder:text-gray-500 border-0 focus:ring-0 hover:bg-gray-100 rounded px-2 py-1.5 -ml-2 transition-colors bg-transparent"
              />
            </div>

            {/* Description / Message */}
            <div className="flex gap-5 items-start group">
              <div className="mt-1 text-gray-500 w-8 flex justify-center">
                <AlignLeft className="w-5 h-5" />
              </div>
              <div className="flex-1 relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Añadir descripción"
                  className="resize-none border-0 bg-gray-50/50 focus:bg-gray-100 text-gray-700 placeholder:text-gray-500 rounded-lg text-sm focus:ring-0 p-3 min-h-[100px]"
                />

                {/* AI Button floating inside */}
                <div className="absolute bottom-2 right-2">
                  <Button
                    type="button"
                    onClick={generateMessageWithAI}
                    disabled={!date || !time || isGenerating}
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full"
                  >
                    {isGenerating ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Patient Info (Guests) */}
            <div className="flex gap-5 items-start group">
              <div className="mt-1 text-gray-500 w-8 flex justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 px-2 py-1 -ml-2 font-medium">
                  {patients.length + 1} invitados
                </div>

                {/* Organizer (Hardcoded as requested) */}
                <div className="flex items-center gap-2 mt-1 px-2 -ml-2 hover:bg-gray-100 rounded py-1 cursor-pointer">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">EB</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">Edgar Alexander Barragan Garcia</span>
                    <span className="text-xs text-gray-500">Organizador</span>
                  </div>
                </div>

                {/* Patients (Guests) */}
                {patients.map((patient, idx) => (
                  <div key={idx} className="flex items-center gap-2 mt-1 px-2 -ml-2 hover:bg-gray-100 rounded py-1 cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email || 'default'}`} />
                      <AvatarFallback>{(patient.name || "P").substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">{patient.name || "Sin nombre"}</span>
                      <span className="text-xs text-gray-500">Invitado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 pt-2 border-t border-gray-100 mt-auto">
            <Button
              type="button"
              variant="ghost"
              className="text-blue-600 hover:bg-blue-50 font-medium text-sm"
            >
              Más opciones
            </Button>
            <Button
              type="submit"
              disabled={!date || !time || !message}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 rounded shadow-sm"
            >
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
