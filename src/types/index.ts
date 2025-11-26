/**
 * Tipos compartidos de la aplicación SEI
 * 
 * Este archivo centraliza todos los tipos e interfaces TypeScript
 * utilizados en múltiples partes de la aplicación.
 */

/**
 * Sucursales disponibles en el sistema
 */
export const sucursales = [
    "AGUASCALIENTES",
    "HERMOSILLO",
    "MONTERREY",
    "TIJUANA"
] as const;

/**
 * Roles de usuario disponibles
 */
export const roles = ["Admin", "User"] as const;

export type Sucursal = typeof sucursales[number];
export type Role = typeof roles[number];

/**
 * Estados posibles del tablero Kanban
 */
export const kanbanStates = [
    "ATENDIDA",
    "AGENDADA",
    "PENDIENTE",
    "RECHAZA",
    "NO ASISTIO",
    "ASISTIO"
] as const;

export type KanbanState = typeof kanbanStates[number];

/**
 * Datos de un paciente en el sistema
 */
export interface Patient {
    /** Número de Historia Clínica */
    NHC?: string;
    /** NHC Definitivo */
    NHCDEFINITIVO?: string;
    /** Nombre completo del paciente */
    NOMBRE?: string;
    /** Teléfono de contacto */
    TELEFONO?: string;
    /** Correo electrónico */
    CORREO?: string;
    /** Estado actual en el Kanban */
    ESTADO?: KanbanState;
    /** Sucursal asignada */
    SUCURSAL?: Sucursal;
    /** Fecha de última actualización */
    FECHA_ACTUALIZACION?: string;
    /** Campos adicionales dinámicos */
    [key: string]: any;
}

/**
 * Datos de una cita médica
 */
export interface Appointment {
    /** Fecha de la cita */
    date: Date;
    /** Hora de la cita en formato HH:mm */
    time: string;
    /** Mensaje o notas adicionales */
    message: string;
}

/**
 * Respuesta genérica de API
 */
export interface ApiResponse<T = any> {
    /** Datos devueltos por la API */
    data?: T;
    /** Mensaje de error si lo hay */
    error?: string;
    /** Detalles adicionales del error */
    details?: string;
    /** Código de estado HTTP */
    status?: number;
}

/**
 * Usuario del sistema
 */
export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    role: Role;
    sucursal: Sucursal;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerId: string;
    tenantId: string | null;
}
