import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

let cache: {
  timestamp: number;
  data: any;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1sRAgbsDii4x9lUmhkhjqwkgj9jx8MiWndXbWSn3H9co';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const now = Date.now();
  const userEmail = session?.user?.email;
  const userRole = session?.user?.role;
  const userSucursal = session?.user?.sucursal;

  const applyFilter = (data: any[]) => {
    if (!data) return null;
    const headers = data[0];
    const sucursalIndex = headers.indexOf('Sucursal');
    if (sucursalIndex === -1) return data;

    if (userEmail === 'eabarragang@ingenes.com') {
      return [headers, ...data.slice(1).filter((row: any) => row[sucursalIndex] === 'MONTERREY')];
    }
    if (userRole !== 'Admin') {
      return [headers, ...data.slice(1).filter((row: any) => row[sucursalIndex] === userSucursal)];
    }
    return data;
  };

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    const filteredData = applyFilter(cache.data);
    return NextResponse.json(filteredData);
  }

  try {
    const range = 'prueba!A:M';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows) {
      cache = {
        timestamp: now,
        data: rows,
      };
      
      const filteredData = applyFilter(rows);
      return NextResponse.json(filteredData);
    } else {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json({ error: 'Failed to fetch sheet data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates } = body;

    const data: { range: string; values: any[][] }[] = [];
    const headers = (await sheets.spreadsheets.values.get({ spreadsheetId, range: 'prueba!A1:M1' })).data.values?.[0];
    if (!headers) {
      throw new Error('Could not find headers in the sheet');
    }

    for (const row in updates) {
      for (const header in updates[row]) {
        const colIndex = headers.indexOf(header);
        if (colIndex !== -1) {
          const col = String.fromCharCode(65 + colIndex);
          data.push({
            range: `prueba!${col}${row}`,
            values: [[updates[row][header]]],
          });
        }
      }
    }

    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data,
      },
    });

    // Invalidate cache
    cache = null;

    return NextResponse.json({ success: true, ...result.data });
  } catch (error) {
    console.error('Error updating sheet data:', error);
    return NextResponse.json({ error: 'Failed to update sheet data' }, { status: 500 });
  }
}
