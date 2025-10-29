import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const n8nWebhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/getSEI';

    // Using { cache: 'no-store' } to ensure fresh data on every request
    const response = await fetch(n8nWebhookUrl, { cache: 'no-store' });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('n8n getSEI webhook failed:', response.status, errorBody);
      return NextResponse.json({ message: 'Failed to fetch data from n8n', details: errorBody }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in get-data API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
