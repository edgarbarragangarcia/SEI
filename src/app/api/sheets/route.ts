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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/sheets received body:', body);

    // Support two shapes:
    // 1) { rowIndex: number, header: string, value: string } -> update a single cell
    // 2) { sheetName: string, values: [[...]] } -> append rows

  if (body && body.NHCDEFINITIVO && body.header && body.value) {
      const nhcVal = body.NHCDEFINITIVO.toString();
      const header = body.header;
      const value = body.value;
      const sheetName = body.sheetName || 'prueba';

      // Read header row
      const headerRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A1:Z1` });
      console.log('Headers found:', headerRes.data.values && headerRes.data.values[0]);
      
      const headers = headerRes.data.values && headerRes.data.values[0] 
        ? headerRes.data.values[0].map((h: any) => h?.toString().trim() || '')
        : [];
      console.log('Looking for header:', header, 'in headers:', headers);
      
      // Find the URL column (looking for exact match first, then case-insensitive)
      let colIndex = headers.indexOf(header);
      if (colIndex === -1) {
        colIndex = headers.findIndex(h => h.toLowerCase() === header.toLowerCase());
      }

      if (colIndex === -1) {
        return NextResponse.json({ 
          error: 'Header not found', 
          header,
          availableHeaders: headers 
        }, { status: 400 });
      }

      // Find row with matching NHC
      const nhcColIndex = headers.findIndex(h => 
        h.toLowerCase().includes('nhc') || 
        h.toLowerCase().includes('definitivo')
      );

      if (nhcColIndex === -1) {
        return NextResponse.json({ 
          error: 'NHC column not found',
          availableHeaders: headers 
        }, { status: 400 });
      }

      // Get NHC column values
      const nhcCol = String.fromCharCode('A'.charCodeAt(0) + nhcColIndex);
      const nhcRange = `${sheetName}!${nhcCol}2:${nhcCol}`;
      const nhcRes = await sheets.spreadsheets.values.get({ 
        spreadsheetId, 
        range: nhcRange 
      });

      // Find the row with matching NHC
      const nhcValues = nhcRes.data.values || [];
      const rowIndex = nhcValues.findIndex(row => 
        row[0]?.toString().trim() === nhcVal.trim()
      ) + 2; // +2 because we start from row 2 and need to account for 0-based index

      if (rowIndex < 2) {
        return NextResponse.json({ 
          error: 'NHC not found', 
          nhc: nhcVal 
        }, { status: 404 });
      }

      // Update the URL cell
      const urlCol = String.fromCharCode('A'.charCodeAt(0) + colIndex);
      const updateRange = `${sheetName}!${urlCol}${rowIndex}`;
      
      console.log('Updating cell:', {
        range: updateRange,
        value,
        nhc: nhcVal,
        rowIndex
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: updateRange,
        valueInputOption: 'RAW',
        requestBody: { values: [[value]] },
      });

      return NextResponse.json({ 
        success: true,
        updated: {
          nhc: nhcVal,
          column: header,
          value: value,
          range: updateRange
        }
      });

      if (colIndex === -1) {
        return NextResponse.json({ error: 'Header not found', header }, { status: 400 });
      }

      const columnLetter = String.fromCharCode('A'.charCodeAt(0) + colIndex);
      const range = `${columnLetter}${rowIndex}:${columnLetter}${rowIndex}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: { values: [[value]] },
      });

      return NextResponse.json({ success: true });
    }

      // Support updating by NHCDEFINITIVO (identifier) e.g. { NHCDEFINITIVO: '123', ESTADO: 'ATENDIDA' }
      if (body && (body.NHCDEFINITIVO || body.nhcdefinitivo || body.nhc)) {
        const nhcVal = (body.NHCDEFINITIVO || body.nhcdefinitivo || body.nhc).toString().trim();
        const newEstado = body.ESTADO ?? body.estado ?? body.value ?? '';
        const sheetName = body.sheetName || 'prueba';

        // Read header row
        const headerRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A1:Z1` });
        const headers = headerRes.data.values && headerRes.data.values[0] ? headerRes.data.values[0].map((h: any) => (h || '').toString().trim().toLowerCase()) : [];

        // Determine id column (search common variants)
        const idCandidates = ['nhcdefinitivo', 'nhc_definitivo', 'nhc', 'nhc_def', 'nhcdef'];
        let idColIndex = -1;
        for (const cand of idCandidates) {
          const idx = headers.indexOf(cand);
          if (idx !== -1) { idColIndex = idx; break; }
        }

        if (idColIndex === -1) {
          return NextResponse.json({ error: 'Could not find NHC column in header', headers }, { status: 400 });
        }

        const idColLetter = String.fromCharCode('A'.charCodeAt(0) + idColIndex);

        // Read id column values starting from row 2
        const idColRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!${idColLetter}2:${idColLetter}` });
        const idValues = idColRes.data.values || [];
        let foundRow = -1;
        for (let i = 0; i < idValues.length; i++) {
          const cell = (idValues[i] && idValues[i][0]) ? idValues[i][0].toString().trim() : '';
          if (cell === nhcVal) { foundRow = i + 2; break; }
        }

        if (foundRow === -1) {
          return NextResponse.json({ error: 'Could not find row for provided NHCDEFINITIVO', nhc: nhcVal }, { status: 404 });
        }

        // Find ESTADO column
        const estadoIdx = headers.indexOf('estado');
        if (estadoIdx === -1) {
          // If ESTADO header not found, try column N (index 13) as fallback
          const fallbackIdx = 13; // column N (0-based)
          const colLetter = String.fromCharCode('A'.charCodeAt(0) + fallbackIdx);
          const range = `${sheetName}!${colLetter}${foundRow}:${colLetter}${foundRow}`;
          await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'RAW', requestBody: { values: [[newEstado]] } });
          return NextResponse.json({ success: true, row: foundRow, col: colLetter });
        }

        const estadoColLetter = String.fromCharCode('A'.charCodeAt(0) + estadoIdx);
        const updateRange = `${sheetName}!${estadoColLetter}${foundRow}:${estadoColLetter}${foundRow}`;
        await sheets.spreadsheets.values.update({ spreadsheetId, range: updateRange, valueInputOption: 'RAW', requestBody: { values: [[newEstado]] } });
        return NextResponse.json({ success: true, row: foundRow, col: estadoColLetter });
      }

      if (body && body.sheetName && Array.isArray(body.values)) {
      const sheetName = body.sheetName;
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: { values: body.values },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error) {
    console.error('Error handling POST /api/sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update sheet', details: errorMessage }, { status: 500 });
  }
}
