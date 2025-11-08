import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    // Verificar autenticación y tokens
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const sessAny = session as any;
    console.log('Session in calendar/create:', {
      hasSession: true,
      user: session.user,
      token: sessAny.accessToken ? 'present' : 'missing'
    });

    const body = await req.json();
    console.log('Calendar event request:', body);
    const { summary, description, start, end, attendees } = body;

    // Use the authenticated user's tokens to create the event in their calendar
    const sessionWithTokens = session as any;
    const accessToken = sessionWithTokens.accessToken;
    const refreshToken = sessionWithTokens.refreshToken;

    if (!accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ 
        error: 'No se encontró el token de acceso en la sesión. Por favor, cierre sesión y vuelva a iniciar sesión.',
        details: 'missing_access_token'
      }, { status: 403 });
    }

    console.log('Tokens found:', {
      hasAccessToken: true,
      hasRefreshToken: !!refreshToken
    });

    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // Crear el evento con Google Meet (conferenceData)
    const event: any = {
      summary,
      description,
      start,
      end,
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const calendarId = 'primary';

    // Try to insert the event. If it fails due to an expired access token, try refreshing
    // using the refresh token and retry once.
    try {
      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      });

      return NextResponse.json({ 
        success: true, 
        eventId: response.data.id,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink 
      });
    } catch (err: any) {
      console.error('Initial calendar insert failed:', err?.message || err);

      // If we have a refresh token, try to refresh the access token and retry once.
      if (refreshToken) {
        try {
          console.log('Attempting token refresh using refresh token...');
          // Ensure the refresh token is set so getAccessToken will attempt a refresh
          oAuth2Client.setCredentials({ refresh_token: refreshToken });

          // getAccessToken will trigger a refresh when needed
          const newToken = await oAuth2Client.getAccessToken();
          // set the refreshed access token (if returned as object or string)
          const accessTokenValue = (newToken && (newToken as any).token) ? (newToken as any).token : newToken;
          if (accessTokenValue) {
            oAuth2Client.setCredentials({ access_token: accessTokenValue, refresh_token: refreshToken });
          }

          // Retry the insert once
          const retryResponse = await calendar.events.insert({
            calendarId,
            requestBody: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
          });

          return NextResponse.json({ 
            success: true, 
            eventId: retryResponse.data.id,
            htmlLink: retryResponse.data.htmlLink,
            hangoutLink: retryResponse.data.hangoutLink
          });
        } catch (retryErr: any) {
          console.error('Retry after token refresh failed:', retryErr?.message || retryErr);
          return NextResponse.json(
            { error: 'Error al crear el evento en el calendario', details: retryErr?.message || retryErr },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Error al crear el evento en el calendario', details: err?.message || err },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al crear evento en el calendario:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento en el calendario' },
      { status: 500 }
    );
  }
}