# Documentación de API - SEI

Esta documentación describe todos los endpoints de la API disponibles en el sistema SEI.

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Endpoints de Datos](#endpoints-de-datos)
- [Endpoints de Calendario](#endpoints-de-calendario)
- [Endpoints de Google Sheets](#endpoints-de-google-sheets)
- [IA y Utilidades](#ia-y-utilidades)

---

## Autenticación

### NextAuth Endpoints

SEI utiliza NextAuth.js para autenticación. Los siguientes endpoints son manejados automáticamente:

#### `GET/POST /api/auth/[...nextauth]`

Endpoints de autenticación manejados por NextAuth:

- `/api/auth/signin` - Inicio de sesión
- `/api/auth/signout` - Cierre de sesión
- `/api/auth/callback/google` - Callback de Google OAuth
- `/api/auth/session` - Obtener sesión actual

**Ejemplo de uso**:
```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

function Component() {
  const { data: session } = useSession();
  
  if (!session) {
    return <button onClick={() => signIn('google')}>Iniciar Sesión</button>
  }
  
  return <button onClick={() => signOut()}>Cerrar Sesión</button>
}
```

---

## Endpoints de Datos

### `GET /api/get-data`

Obtiene la lista de pacientes desde n8n.

**Parámetros**: Ninguno

**Respuesta exitosa (200)**:
```typescript
Patient[] // Array de pacientes

// Ejemplo:
[
  {
    "NHCDEFINITIVO": "12345",
    "NOMBRE": "Juan Pérez",
    "TELEFONO": "5551234567",
    "CORREO": "juan@example.com",
    "ESTADO": "PENDIENTE",
    "SUCURSAL": "MONTERREY"
  },
  // ...
]
```

**Respuesta de error (404)**:
```json
{
  "error": "Recurso no encontrado",
  "details": "La fuente de datos devolvió resultados vacíos"
}
```

**Respuesta de error (500)**:
```json
{
  "error": "Error interno del servidor",
  "details": "Descripción del error"
}
```

**Ejemplo de uso**:
```typescript
const response = await fetch('/api/get-data');
const patients = await response.json();
```

---

### `POST /api/update-status`

Actualiza el estado de un paciente.

**Body**:
```typescript
{
  NHCDEFINITIVO: string;    // Requerido
  ESTADO: KanbanState;      // Requerido
  NOMBRE?: string;
  APELLIDOP?: string;
  APELLIDOM?: string;
  TELEFONO?: string;
}
```

**Estados válidos**:
- `ATENDIDA`
- `AGENDADA`
- `PENDIENTE`
- `RECHAZA`
- `NO ASISTIO`
- `ASISTIO`

**Respuesta exitosa (200)**:
```json
{
  "data": "Actualización exitosa",
  "details": "..."
}
```

**Respuesta de error (400)**:
```json
{
  "error": "Campo requerido faltante: NHCDEFINITIVO",
  "details": "El campo NHCDEFINITIVO es requerido pero no fue proporcionado en la petición"
}
```

**Ejemplo de uso**:
```typescript
const response = await fetch('/api/update-status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    NHCDEFINITIVO: '12345',
    ESTADO: 'ATENDIDA',
    NOMBRE: 'Juan'
  })
});
```

---

## Endpoints de Calendario

### `POST /api/calendar/create`

Crea un evento en Google Calendar con enlace de Google Meet.

**Requiere autenticación**: Sí (token de Google OAuth)

**Body**:
```typescript
{
  summary: string;        // Título del evento
  description: string;    // Descripción
  start: {
    dateTime: string;     // ISO 8601 format
    timeZone: string;     // e.g., "America/Mexico_City"
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
  }>;
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "eventId": "abc123...",
  "htmlLink": "https://calendar.google.com/event?...",
  "hangoutLink": "https://meet.google.com/xyz-..."
}
```

**Respuesta de error (401)**:
```json
{
  "error": "No autorizado"
}
```

**Respuesta de error (403)**:
```json
{
  "error": "No se encontró el token de acceso en la sesión...",
  "details": "missing_access_token"
}
```

**Ejemplo de uso**:
```typescript
const appointmentData = {
  summary: "Cita médica - Juan Pérez",
  description: "Cita de seguimiento",
  start: {
    dateTime: "2025-11-26T10:00:00",
    timeZone: "America/Mexico_City"
  },
  end: {
    dateTime: "2025-11-26T11:00:00",
    timeZone: "America/Mexico_City"
  },
  attendees: [
    { email: "paciente@example.com" },
    { email: "doctor@ingenes.com" }
  ]
};

const response = await fetch('/api/calendar/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(appointmentData)
});
```

---

## Endpoints de Google Sheets

### `GET /api/sheets`

Obtiene datos de una hoja de Google Sheets.

**Parámetros de query**:
- `sheetName` (requerido): Nombre de la hoja
- `columns` (opcional): Columnas a obtener (e.g., "A,C,D")

**Ejemplo**:
```
GET /api/sheets?sheetName=pacientes&columns=A,B,C
```

**Respuesta (200)**:
```json
[
  ["Nombre", "Email", "Teléfono"],
  ["Juan Pérez", "juan@example.com", "555-1234"],
  ["María López", "maria@example.com", "555-5678"]
]
```

---

### `POST /api/sheets`

Actualiza o agrega datos a Google Sheets.

**Body opción 1** (Actualizar celda por NHC):
```typescript
{
  NHCDEFINITIVO: string;
  header: string;          // Nombre de la columna
  value: string;           // Nuevo valor
  sheetName?: string;      // Default: "prueba"
}
```

**Body opción 2** (Agregar filas):
```typescript
{
  sheetName: string;
  values: string[][];      // Array de filas
}
```

**Ejemplo de uso**:
```typescript
// Actualizar URL de Meet
const response = await fetch('/api/sheets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    NHCDEFINITIVO: '12345',
    header: 'URL_MEET',
    value: 'https://meet.google.com/xyz-...',
    sheetName: 'pacientes'
  })
});
```

---

## IA y Utilidades

### `POST /api/generate-message`

Genera un mensaje personalizado usando Google Gemini AI.

**Body**:
```typescript
{
  date: string;      // Fecha de la cita
  time: string;      // Hora de la cita
  patients: string;  // Nombre(s) del paciente
}
```

**Respuesta (200)**:
```json
{
  "message": "Hola Juan,\n\nTu cita ha sido programada...",
  "success": true
}
```

**Ejemplo de uso**:
```typescript
const response = await fetch('/api/generate-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '26 de noviembre, 2025',
    time: '10:00',
    patients: 'Juan Pérez'
  })
});

const { message } = await response.json();
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Solicitud exitosa |
| 400 | Solicitud mal formada (faltan parámetros) |
| 401 | No autenticado |
| 403 | No autorizado (sin permisos) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## Headers Comunes

Todas las peticiones POST deben incluir:

```typescript
{
  'Content-Type': 'application/json'
}
```

## Manejo de Errores

Todas las respuestas de error siguen el formato:

```typescript
interface ApiResponse {
  error: string;      // Mensaje de error principal
  details?: string;   // Detalles adicionales
  status?: number;    // Código HTTP
}
```

**Ejemplo de manejo**:
```typescript
try {
  const response = await fetch('/api/get-data');
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error, error.details);
    return;
  }
  const data = await response.json();
  // procesar data...
} catch (error) {
  console.error('Error de red:', error);
}
```

## Rate Limiting

> [!NOTE]
> Actualmente no hay rate limiting implementado. Se recomienda agregar en producción.

## Webhooks de n8n

Los siguientes webhooks de n8n son utilizados por las API routes:

- `https://n8nqa.ingenes.com:5689/webhook/getSEI` - Obtener datos
- `https://n8nqa.ingenes.com:5689/webhook/postSEI` - Actualizar estado

---

Para más información sobre la arquitectura del sistema, ver [ARQUITECTURA.md](./ARQUITECTURA.md)
