
'use server';

import { google } from 'googleapis';
import credentials from '@/lib/google-credentials.json';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function getJwtClient() {
  const privateKey = credentials.private_key.replace(/\\n/g, '\n');
  return new google.auth.JWT(
    credentials.client_email,
    undefined,
    privateKey,
    SCOPES
  );
}

function extractSheetIdFromUrl(url: string): string | null {
    const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

export async function getSheetData(sheetUrl: string) {
  try {
    const sheetId = extractSheetIdFromUrl(sheetUrl);
    if (!sheetId) {
        return { error: 'Invalid Google Sheet URL. Could not extract Sheet ID.' };
    }

    const auth = getJwtClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Assume data is in a sheet named 'BASE DE TRABAJO' and the range covers columns A-L.
    const range = 'BASE DE TRABAJO!A:L';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { data: [] };
    }

    const headers = rows[0] as string[];
    const data = rows.slice(1).map(row => {
      const rowData: Record<string, any> = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    return { data };

  } catch (error: any) {
    console.error("Error fetching sheet data:", error);
    if (error.code === 403) {
      return { error: 'Permission denied. Make sure the service account email has access to the Google Sheet.' };
    }
    if (error.code === 404) {
        return { error: 'Sheet not found. Please check the URL and Sheet ID.'};
    }
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}
