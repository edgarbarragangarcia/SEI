import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request to /api/update-status with body:', body);
    const { NHCDEFINITIVO, ESTADO, NOMBRE, APELLIDOP, APELLIDOM, TELEFONO } = body;

    if (!NHCDEFINITIVO || !ESTADO) {
      return NextResponse.json({ message: 'Missing NHCDEFINITIVO or ESTADO' }, { status: 400 });
    }

    const n8nWebhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/postSEI';

    const payload = {
      NHCDEFINITIVO,
      ESTADO: ESTADO.toUpperCase(),
      NOMBRE,
      APELLIDOP,
      APELLIDOM,
      TELEFONO,
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // The body of the response from n8n might not be JSON, so we handle it carefully.
    const responseData = await response.text();

    if (!response.ok) {
      console.error('n8n webhook failed:', response.status, responseData);
      return NextResponse.json({ message: 'Failed to update status in n8n', details: responseData }, { status: response.status });
    }

    return NextResponse.json({ message: 'Status updated successfully', n8nResponse: responseData });
  } catch (error) {
    console.error('Error in /api/update-status:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
