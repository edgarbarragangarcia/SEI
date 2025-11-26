# Guía de Componentes - SEI

Esta guía documenta los componentes principales de la aplicación SEI, su propósito, props, y ejemplos de uso.

## Distinción: Páginas vs Componentes

> [!IMPORTANT]
> **Páginas** están en `/src/app/` y definen rutas  
> **Componentes** están en `/src/components/` y son reutilizables

### Ejemplo de Route Group: `(protected)`

```
app/(protected)/        ← Route Group (NO es componente)
  ├── admin/page.tsx    → Ruta: /admin
  ├── dashboard/page.tsx → Ruta: /dashboard
  └── layout.tsx        → Layout compartido

components/             ← Componentes reutilizables
  ├── kanban-board.tsx
  └── metrics-dashboard.tsx
```

El paréntesis `(protected)` es una característica de Next.js que agrupa rutas sin afectar URLs.

---

## Componentes Principales

## `<KanbanBoard />`

Tablero Kanban interactivo con drag-and-drop para gestionar pacientes.

**Ubicación**: `/src/components/kanban-board.tsx`

### Funcionalidades

- Drag & Drop de tarjetas entre columnas
- Carga de datos desde API
- Modal de programación de citas
- Actualización en tiempo real

### Estados del Kanban

```typescript
const states = [
  "ATENDIDA",
  "AGENDADA", 
  "PENDIENTE",
  "RECHAZA",
  "NO ASISTIO",
  "ASISTIO"
];
```

### Tipos

```typescript
interface Patient {
  NHCDEFINITIVO?: string;
  NOMBRE?: string;
  TELEFONO?: string;
  CORREO?: string;
  ESTADO?: KanbanState;
  SUCURSAL?: Sucursal;
}
```

### Uso

```typescript
// app/(protected)/kanban/page.tsx
import KanbanBoard from '@/components/kanban-board';

export default function KanbanPage() {
  return <KanbanBoard />;
}
```

### Flujo de Datos

1. **Montaje**: Carga pacientes desde `/api/get-data`
2. **Drag & Drop**: Actualiza estado local y llama a `/api/update-status`
3. **Modal**: Al mover a "ATENDIDA" desde "PROSPECTO", abre modal de agendamiento
4. **Calendario**: Crea evento en Google Calendar con link de Meet

---

## `<MetricsDashboard />`

Dashboard de métricas en tiempo real con gráficas.

**Ubicación**: `/src/components/metrics-dashboard-real.tsx`

### Funcionalidades

- Gráficas de barras y líneas (ApexCharts)
- KPIs en tiempo real
- Filtros por fecha
- Export de datos

### Props

```typescript
interface MetricsDashboardProps {
  data?: Patient[];
  refreshInterval?: number; // ms
}
```

### Uso

```typescript
import MetricsDashboard from '@/components/metrics-dashboard-real';

export default function DashboardPage() {
  return <MetricsDashboard refreshInterval={30000} />;
}
```

---

## `<ScheduleAppointmentModal />`

Modal para programar citas con generación de mensajes IA.

**Ubicación**: `/src/components/schedule-appointment-modal.tsx`

### Funcionalidades

- Selector de fecha y hora
- Generación de mensaje personalizado con Gemini AI
- Creación de evento en Google Calendar
- Envío de invitaciones

### Props

```typescript
interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSchedule: (data: AppointmentData) => Promise<void>;
}
```

### Uso

```typescript
const [modalOpen, setModalOpen] = useState(false);
const [selectedPatient, setSelectedPatient] = useState(null);

<ScheduleAppointmentModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  patient={selectedPatient}
  onSchedule={async (data) => {
    // Crear evento
    await createCalendarEvent(data);
  }}
/>
```

---

## `<Header />`

Header principal de la aplicación con navegación.

**Ubicación**: `/src/components/header.tsx`

### Funcionalidades

- Navegación entre secciones
- Información del usuario
- Botón de logout

### Uso

```typescript
// app/(protected)/layout.tsx
import { Header } from '@/components/header';

export default function ProtectedLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

---

## `<UserNav />`

Dropdown de navegación de usuario con avatar.

**Ubicación**: `/src/components/user-nav.tsx`

### Funcionalidades

- Avatar del usuario
- Menú desplegable con opciones
- Logout

### Props

```typescript
interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
```

---

## Componentes UI (shadcn/ui)

Ubicación: `/src/components/ui/`

Estos son componentes primitivos reutilizables basados en Radix UI:

### Botones

```typescript
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
```

**Variantes**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

---

### Cards

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
</Card>
```

---

### Dialogs (Modales)

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título del Modal</DialogTitle>
    </DialogHeader>
    {/* Contenido */}
  </DialogContent>
</Dialog>
```

---

### Forms

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="name">Nombre</Label>
  <Input id="name" placeholder="Ingresa tu nombre" />
</div>
```

---

### Select

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
  </SelectContent>
</Select>
```

---

## Patrones de Uso Comunes

### Client Component con Estado

```typescript
'use client';

import { useState, useEffect } from 'react';

export function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/get-data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{/* render */}</div>;
}
```

### Server Component con Datos

```typescript
// No necesita 'use client'
async function fetchData() {
  const res = await fetch('...', { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const data = await fetchData();
  return <div>{/* render */}</div>;
}
```

### Composición de Componentes

```typescript
// Página usa componentes
export default function DashboardPage() {
  return (
    <div>
      <MetricsCard />
      <ChartComponent />
      <DataTable />
    </div>
  );
}
```

---

## Mejores Prácticas

1. **Separar lógica de UI**: Hooks personalizados en `/src/hooks/`
2. **Tipos compartidos**: Importar desde `/src/types/`
3. **Constantes**: Usar desde `/src/lib/constants.ts`
4. **Server Components por defecto**: Solo usar `'use client'` cuando sea necesario
5. **Composición**: Componentes pequeños y enfocados
6. **Props tipadas**: Siempre definir interfaces para props

---

## Componentes a Crear (Futuras Mejoras)

- [ ] `<PatientCard />` - Tarjeta individual de paciente
- [ ] `<FilterBar />` - Barra de filtros reutilizable
- [ ] `<ExportButton />` - Botón para exportar datos
- [ ] `<NotificationToast />` - Sistema de notificaciones
- [ ] `<LoadingSpinner />` - Spinner de carga consistente

---

Para más información:
- [Arquitectura del Sistema](./ARQUITECTURA.md)
- [Documentación de API](./API.md)
- [README Principal](../README.md)
