import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const n8nWebhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/getSEI';

    // Using { cache: 'no-store' } to ensure fresh data on every request
    const response = await fetch(n8nWebhookUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      let errorDetails = 'Unknown error';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error('n8n getSEI webhook failed:', response.status, errorDetails);
      return NextResponse.json({ 
        error: 'Failed to fetch data from n8n', 
        details: errorDetails,
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json({ 
        error: 'No data available', 
        details: 'The data source returned empty results'
      }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in get-data API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
