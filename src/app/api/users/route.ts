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
const usersSheetName = 'Users';

export async function GET() {
  try {
    // Check for required environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_ID) {
      console.error('Missing required environment variables for Google Sheets API');
      return NextResponse.json({
        error: 'Configuration Error',
        details: 'Missing required environment variables',
        missingVars: {
          GOOGLE_CLIENT_EMAIL: !process.env.GOOGLE_CLIENT_EMAIL,
          GOOGLE_PRIVATE_KEY: !process.env.GOOGLE_PRIVATE_KEY,
          GOOGLE_SHEETS_ID: !process.env.GOOGLE_SHEETS_ID
        }
      }, { status: 500 });
    }

    // First verify if we can access the spreadsheet
    try {
      await sheets.spreadsheets.get({ spreadsheetId });
    } catch (error: any) {
      console.error('Error accessing spreadsheet:', error);
      if (error.code === 403) {
        return NextResponse.json({
          error: 'Permission denied',
          details: 'The service account does not have access to the spreadsheet. Please check the sharing settings.',
          action: 'Share the spreadsheet with: ' + process.env.GOOGLE_CLIENT_EMAIL
        }, { status: 403 });
      } else if (error.code === 404) {
        return NextResponse.json({
          error: 'Spreadsheet not found',
          details: 'The specified spreadsheet ID does not exist or is incorrect.',
          spreadsheetId
        }, { status: 404 });
      }
      throw error;
    }

    // Then try to get the values
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${usersSheetName}!A:D`,
    });

    if (!response.data.values) {
      return NextResponse.json({
        message: 'No data found in sheet',
        sheetName: usersSheetName,
        range: 'A:D'
      }, { status: 200 });
    }

    return NextResponse.json(response.data.values);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    const errorDetails = {
      error: 'Failed to fetch users',
      details: error.message,
      code: error.code,
      status: error.status,
      spreadsheetId,
      sheetName: usersSheetName,
      serviceAccount: process.env.GOOGLE_CLIENT_EMAIL ? 'Set' : 'Missing'
    };
    return NextResponse.json(errorDetails, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const users = await req.json();

    // Verify sheet access first
    try {
      await sheets.spreadsheets.get({ spreadsheetId });
    } catch (error: any) {
      if (error.code === 403) {
        return NextResponse.json({
          error: 'Permission denied',
          details: 'The service account does not have write access to the spreadsheet.',
          action: 'Grant edit permissions to: ' + process.env.GOOGLE_CLIENT_EMAIL
        }, { status: 403 });
      }
      throw error;
    }

    // Verify sheet exists and create if it doesn't
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetExists = spreadsheet.data.sheets?.some(
        s => s.properties?.title === usersSheetName
      );

      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: { title: usersSheetName }
              }
            }]
          }
        });
      }
    } catch (error: any) {
      return NextResponse.json({
        error: 'Failed to verify/create sheet',
        details: error.message,
        sheetName: usersSheetName
      }, { status: 500 });
    }

    // Attempt the update
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${usersSheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: users,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Users updated successfully',
      updatedCount: users.length
    });
  } catch (error: any) {
    console.error('Error updating users:', error);
    return NextResponse.json({
      error: 'Failed to update users',
      details: error.message,
      code: error.code,
      status: error.status,
      spreadsheetId,
      sheetName: usersSheetName,
      serviceAccount: process.env.GOOGLE_CLIENT_EMAIL
    }, { status: 500 });
  }
}