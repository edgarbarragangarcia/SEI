"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Calendar as CalendarIcon, MessageSquare, Sparkles, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Array<{ name: string; email: string; phone: string; }>;
  onSchedule: (data: {
    date: Date;
    time: string;
    message: string;
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
      onSchedule({ date, time, message });
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
      <DialogContent className="max-w-sm border-0 shadow-xl bg-white overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Agendar Cita
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
                className="w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  caption: "text-xs font-semibold p-2",
                  head_row: "grid grid-cols-7 gap-0.5",
                  head_cell: "text-xs font-medium text-gray-600 text-center",
                  row: "grid grid-cols-7 gap-0.5 w-full",
                  cell: "h-7 w-full p-0",
                  day: "h-7 w-full text-xs p-0 rounded hover:bg-blue-100",
                  day_selected: "bg-blue-600 text-white",
                  day_today: "bg-blue-100 font-bold",
                  day_outside: "text-gray-400",
                  day_disabled: "text-gray-300",
                  day_range_middle: "bg-blue-50",
                  day_hidden: "invisible",
                  nav: "flex justify-between items-center p-2 gap-1",
                  nav_button: "h-6 w-6 text-xs hover:bg-gray-200 rounded",
                  nav_button_previous: "",
                  nav_button_next: "",
                }}
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          {/* Hora */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Hora</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="border-gray-300 bg-white text-gray-900 rounded-lg h-9 text-sm hover:border-blue-400 transition-colors">
                <SelectValue placeholder="Selecciona hora" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 bg-white text-gray-900">
                {availableTimes.map((t) => (
                  <SelectItem key={t} value={t} className="text-sm">
                    {t} hrs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mensaje */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">Mensaje</label>
              <Button
                type="button"
                onClick={generateMessageWithAI}
                disabled={!date || !time || isGenerating}
                className="h-6 px-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium rounded flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Mensaje al paciente..."
              className="resize-none border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-lg text-sm hover:border-blue-400 transition-colors"
            />
          </div>

          {/* Botones */}
          <DialogFooter className="flex gap-2 pt-2">
            <Button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg h-9 text-sm font-medium transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!date || !time || !message}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg h-9 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
