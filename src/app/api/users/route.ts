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
const spreadsheetId = '1sRAgbsDii4x9lUmhkhjqwkgj9jx8MiWndXbWSn3H9co';
const usersSheetName = 'Users';

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${usersSheetName}!A:D`,
    });
    return NextResponse.json(response.data.values);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const users = await req.json();
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${usersSheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: users,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating users:', error);
    return NextResponse.json({ error: 'Failed to update users' }, { status: 500 });
  }
}