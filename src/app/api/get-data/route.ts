import { NextResponse } from 'next/server';
import { N8N_WEBHOOKS, ERROR_MESSAGES } from '@/lib/constants';
import type { Patient, ApiResponse } from '@/types';

/**
 * GET /api/get-data
 * 
 * Obtiene los datos de pacientes desde el webhook de n8n.
 * Esta ruta se utiliza para poblar el tablero Kanban y otros componentes
 * que requieren información de pacientes.
 * 
 * @returns {Promise<NextResponse<Patient[] | ApiResponse>>} Lista de pacientes o error
 */
export async function GET() {
  try {
    // Realizar petición al webhook de n8n con cache deshabilitado para datos frescos
    const response = await fetch(N8N_WEBHOOKS.GET_SEI, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Manejar errores de la respuesta HTTP
    if (!response.ok) {
      let errorDetails = 'Error desconocido';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      }

      console.error('Error en webhook n8n getSEI:', response.status, errorDetails);

      return NextResponse.json<ApiResponse>({
        error: ERROR_MESSAGES.FETCH_FAILED,
        details: errorDetails,
        status: response.status
      }, { status: response.status });
    }

    // Parsear y validar datos
    const data = await response.json() as Patient[];

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json<ApiResponse>({
        error: ERROR_MESSAGES.NOT_FOUND,
        details: 'La fuente de datos devolvió resultados vacíos'
      }, { status: 404 });
    }

    return NextResponse.json<Patient[]>(data);
  } catch (error) {
    console.error('Error en ruta API get-data:', error);
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;

    return NextResponse.json<ApiResponse>({
      error: ERROR_MESSAGES.INTERNAL_ERROR,
      details: errorMessage
    }, { status: 500 });
  }
}

