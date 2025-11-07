"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  // Mensaje predeterminado que incluye la fecha y hora
  React.useEffect(() => {
    if (date && time) {
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
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programar Cita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Hora</label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t} hrs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mensaje de confirmación</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Escribe el mensaje que se enviará al paciente..."
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!date || !time || !message}
              className="bg-primary"
            >
              Programar y Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}