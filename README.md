# SEI - Sistema de Experiencia Ingenes

## 📋 Descripción

**SEI (Sistema de Experiencia Ingenes)** es una aplicación web moderna desarrollada con Next.js que permite gestionar y dar seguimiento a pacientes prospecto a través de un sistema de tablero Kanban interactivo. La aplicación se integra con Google Calendar, n8n para automatización de workflows, y utiliza inteligencia artificial para la generación de mensajes personalizados.

## ✨ Funcionalidades Principales

- 🎯 **Tablero Kanban Interactivo**: Sistema de arrastrar y soltar para gestionar estados de pacientes
- 📊 **Dashboard de Métricas**: Visualización en tiempo real de estadísticas y KPIs
- 📅 **Integración con Google Calendar**: Programación automática de citas médicas con Google Meet
- 🤖 **Generación de Mensajes con IA**: Mensajes personalizados generados con Google Gemini
- 🔄 **Sincronización con Google Sheets**: Integración bidireccional con hojas de cálculo
- 🔐 **Autenticación con NextAuth**: Sistema seguro de autenticación con Google OAuth
- 📱 **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- 🌙 **Modo Oscuro**: Soporte para tema claro y oscuro

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 15.3](https://nextjs.org/) con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui components
- **Autenticación**: NextAuth.js con Google Provider
- **Drag & Drop**: react-dnd + react-dnd-html5-backend
- **Gráficas**: ApexCharts + Recharts
- **Animaciones**: Framer Motion
- **APIs**: Google Calendar API, Google Sheets API, Google Gemini AI
- **Automatización**: Integración con n8n webhooks

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Google Cloud con APIs habilitadas:
  - Google Calendar API
  - Google Sheets API
  - Google Generative AI (Gemini)
- Cuenta de n8n configurada con webhooks

## 🚀 Instalación

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd SEI-repo
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:9004
NEXTAUTH_SECRET=<tu-secret-generado>

# Google OAuth
GOOGLE_CLIENT_ID=<tu-client-id>
GOOGLE_CLIENT_SECRET=<tu-client-secret>

# Google Sheets API (Service Account)
GOOGLE_CLIENT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<service-account-private-key>
GOOGLE_SHEETS_ID=<tu-spreadsheet-id>

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=<tu-api-key>

# n8n Webhooks
N8N_GET_SEI_WEBHOOK=https://n8nqa.ingenes.com:5689/webhook/getSEI
N8N_UPDATE_STATUS_WEBHOOK=https://n8nqa.ingenes.com:5689/webhook/postSEI
```

4. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9004`

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Compila la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica los tipos de TypeScript

## 📁 Estructura del Proyecto

```
SEI-repo/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (protected)/        # Rutas protegidas con autenticación
│   │   │   ├── admin/          # Panel de administración
│   │   │   ├── agenda-naranja/ # Agenda naranja
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   └── kanban/         # Tablero Kanban
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # NextAuth endpoints
│   │   │   ├── calendar/       # Integración con Google Calendar
│   │   │   ├── generate-message/ # Generación de mensajes con IA
│   │   │   ├── get-data/       # Obtener datos de pacientes
│   │   │   ├── sheets/         # Integración con Google Sheets
│   │   │   └── update-status/  # Actualizar estado de pacientes
│   │   ├── auth/               # Páginas de autenticación
│   │   └── landing/            # Página de inicio
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes UI de shadcn
│   │   ├── kanban-board.tsx    # Tablero Kanban principal
│   │   ├── metrics-dashboard.tsx
│   │   └── ...
│   ├── lib/                    # Utilidades y helpers
│   │   ├── constants.ts        # Constantes de la aplicación
│   │   ├── firebase.ts         # Configuración de Firebase
│   │   └── utils.ts            # Funciones utilitarias
│   ├── types/                  # Tipos TypeScript compartidos
│   │   └── index.ts
│   └── store/                  # Estado global (Zustand)
├── docs/                       # Documentación adicional
├── public/                     # Archivos estáticos
└── middleware.ts               # Middleware de Next.js
```

## 🔑 Configuración de Google Cloud

### 1. Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Google Calendar API**
4. Configura la pantalla de consentimiento OAuth
5. Crea credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - URIs autorizados: `http://localhost:9004`
   - URIs de redirección: `http://localhost:9004/api/auth/callback/google`

### 2. Service Account (para Sheets)

1. En Google Cloud Console, ve a "Credenciales"
2. Crea una cuenta de servicio
3. Descarga la clave JSON
4. Copia el email y la clave privada a tus variables de entorno
5. Comparte tu Google Sheet con el email de la cuenta de servicio

### 3. Google Gemini AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la clave a `GOOGLE_GEMINI_API_KEY`

## 📚 Documentación Adicional

Para más información, consulta la documentación completa en la carpeta `/docs`:

- [Arquitectura del Sistema](./docs/ARQUITECTURA.md)
- [Documentación de API](./docs/API.md)
- [Guía de Componentes](./docs/COMPONENTES.md)

## 🤝 Contribución

Este es un proyecto privado de Ingenes. Para contribuir:

1. Crea una rama desde `main`
2. Realiza tus cambios
3. Asegúrate de que el build funcione: `npm run build`
4. Verifica los tipos: `npm run typecheck`
5. Crea un Pull Request

## 📝 Licencia

Propiedad de Ingenes - Todos los derechos reservados.

## 🆘 Soporte

Para reportar problemas o solicitar ayuda, contacta al equipo de desarrollo de Ingenes.

---

**Versión**: 0.1.0  
**Última actualización**: Noviembre 2025
