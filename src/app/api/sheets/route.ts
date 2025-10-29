import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

const columnToIndex = (col: string) => {
    return col.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
};

export async function GET(req: NextRequest) {
  const sheetName = req.nextUrl.searchParams.get('sheetName');
  const columns = req.nextUrl.searchParams.get('columns'); // e.g., "A,C,D"

  if (!sheetName) {
    return NextResponse.json({ error: 'Sheet name is required' }, { status: 400 });
  }

  // IMPORTANT: Sheet names with spaces must be wrapped in single quotes.
  const range = `${sheetName}!A:Z`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json([]); // Return empty array for no data
    }

    // If no specific columns are requested, return all data.
    if (!columns) {
      return NextResponse.json(rows);
    }

    // If columns are requested, filter the data.
    const desiredIndices = columns.split(',').map(c => columnToIndex(c.trim()));
    
    const filteredData = rows.map(row => {
        const newRow = [];
        for (const index of desiredIndices) {
            newRow.push(row[index] !== undefined ? row[index] : '');
        }
        return newRow;
    });

    return NextResponse.json(filteredData);

  } catch (error) {
    console.error('Error fetching sheet data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch sheet data', details: errorMessage }, { status: 500 });
  }
}
