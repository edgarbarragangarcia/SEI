/**
 * Constantes de la aplicación SEI
 * 
 * Este archivo contiene todas las constantes utilizadas en la aplicación,
 * incluyendo configuraciones, URLs, y valores fijos.
 */

/**
 * URLs de webhooks de n8n
 */
export const N8N_WEBHOOKS = {
    /** Webhook para obtener datos SEI */
    GET_SEI: 'https://n8nqa.ingenes.com:5689/webhook/getSEI',
    /** Webhook para actualizar estado */
    UPDATE_STATUS: 'https://n8nqa.ingenes.com:5689/webhook/updateStatusSEI',
    /** Webhook para crear eventos de calendario */
    CREATE_CALENDAR: 'https://n8nqa.ingenes.com:5689/webhook/createCalendarEventSEI',
} as const;

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
    /** Puerto de desarrollo */
    DEV_PORT: 9004,
    /** Nombre de la aplicación */
    APP_NAME: 'SEI - Sistema de Experiencia Ingenes',
    /** Versión de la aplicación */
    VERSION: '0.1.0',
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
    FETCH_FAILED: 'Error al obtener los datos',
    UPDATE_FAILED: 'Error al actualizar la información',
    UNAUTHORIZED: 'No autorizado',
    NOT_FOUND: 'Recurso no encontrado',
    INTERNAL_ERROR: 'Error interno del servidor',
} as const;

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
    UPDATE_SUCCESS: 'Actualización exitosa',
    CREATE_SUCCESS: 'Creado exitosamente',
    DELETE_SUCCESS: 'Eliminado exitosamente',
} as const;
