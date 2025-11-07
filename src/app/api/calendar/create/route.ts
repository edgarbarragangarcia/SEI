import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { summary, description, start, end, attendees } = body;

    // Configurar cliente de Google Calendar
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Crear el evento
    const event = {
      summary,
      description,
      start,
      end,
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Recordatorio por email 24 horas antes
          { method: 'popup', minutes: 30 }, // Recordatorio emergente 30 minutos antes
        ],
      },
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      throw new Error('ID del calendario no configurado');
    }

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all', // Envía invitaciones por email automáticamente
    });

    return NextResponse.json({ 
      success: true, 
      eventId: response.data.id,
      htmlLink: response.data.htmlLink 
    });

  } catch (error) {
    console.error('Error al crear evento en el calendario:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento en el calendario' },
      { status: 500 }
    );
  }
}