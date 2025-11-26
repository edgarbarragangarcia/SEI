import { NextResponse } from 'next/server';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import type { Patient, ApiResponse, KanbanState } from '@/types';

/**
 * Interfaz para el cuerpo de la petición de actualización de estado
 */
interface UpdateStatusRequest {
  /** Número de Historia Clínica Definitivo (requerido) */
  NHCDEFINITIVO: string;
  /** Nuevo estado del paciente (requerido) */
  ESTADO: KanbanState;
  /** Nombre del paciente */
  NOMBRE?: string;
  /** Apellido paterno */
  APELLIDOP?: string;
  /** Apellido materno */
  APELLIDOM?: string;
  /** Teléfono de contacto */
  TELEFONO?: string;
}

/**
 * POST /api/update-status
 * 
 * Actualiza el estado de un paciente en el sistema.
 * Envía los datos al webhook de n8n para procesamiento.
 * 
 * @param {Request} request - Petición HTTP con los datos del paciente
 * @returns {Promise<NextResponse<ApiResponse>>} Respuesta de éxito o error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as UpdateStatusRequest;
    console.log('Recibida petición a /api/update-status con body:', body);

    const { NHCDEFINITIVO, ESTADO, NOMBRE, APELLIDOP, APELLIDOM, TELEFONO } = body;

    // Validar campos requeridos
    if (!NHCDEFINITIVO || !ESTADO) {
      const missingField = !NHCDEFINITIVO ? 'NHCDEFINITIVO' : 'ESTADO';
      return NextResponse.json<ApiResponse>({
        error: `Campo requerido faltante: ${missingField}`,
        details: `El campo ${missingField} es requerido pero no fue proporcionado en la petición`
      }, { status: 400 });
    }

    const n8nWebhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/postSEI';

    const payload: UpdateStatusRequest = {
      NHCDEFINITIVO,
      ESTADO: ESTADO.toUpperCase() as KanbanState,
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

    // La respuesta de n8n puede no ser JSON, manejar con cuidado
    const responseData = await response.text();

    if (!response.ok) {
      console.error('Error en webhook n8n:', response.status, responseData);
      return NextResponse.json<ApiResponse>({
        error: 'Error al actualizar el estado en n8n',
        details: responseData
      }, { status: response.status });
    }

    return NextResponse.json<ApiResponse>({
      data: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      details: responseData
    });
  } catch (error) {
    console.error('Error en /api/update-status:', error);
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;

    return NextResponse.json<ApiResponse>({
      error: ERROR_MESSAGES.INTERNAL_ERROR,
      details: errorMessage
    }, { status: 500 });
  }
}

