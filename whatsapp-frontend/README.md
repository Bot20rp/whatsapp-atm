# WhatsApp CRM Multi-Tenant (Frontend)

Frontend corporativo de alto rendimiento para la gestión multi-tenant de conversaciones entre clientes y bots/agentes mediante la WhatsApp Business Cloud API. Desarrollado con **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** y **DaisyUI**.

---

## 1. Arquitectura Multi-Tenant

El CRM implementa aislamiento estricto de datos en dos niveles jerárquicos:
1. **Empresa (Tenant)**: Cada organización cliente dispone de su propia configuración, plan, límites mensuales y usuarios.
2. **Línea WhatsApp (WABA Number)**: Cada empresa puede operar uno o varios números corporativos independientes (ej. Ventas, Soporte N2, Cobranzas).

### Componentes Clave del Contexto
- **`TenantProvider` (`src/app/providers/TenantProvider.tsx`)**: Almacena y provee el estado reactivo del tenant activo (`empresaActual`), la línea activa (`numeroActual`), y las colecciones disponibles. Persiste la selección en `localStorage`.
- **Selector en Encabezado (`DashboardLayout.tsx`)**: Menú desplegable corporativo que permite cambiar instantáneamente de empresa y de línea. Al alternar, todas las vistas se sincronizan automáticamente.
- **Aislamiento en Consultas**: Todas las funciones de las APIs de features filtran obligatoriamente por `empresaId` y `numeroId`.

---

## 2. Paleta de Colores y Lineamientos Visuales

El diseño responde a una estética corporativa, sobria y profesional:
- **Color Primario**: `#6B9080` (Verde corporativo)
- **Color Secundario**: `#B2C8B2` (Salvia suave)
- **Superficie / Neutral**: `#DEE2D3` y fondos `#F5F7F4`
- **Tipografía**: Sans-serif de corte empresarial (Inter / sistema operativo).
- **Iconografía**: Lucide React. **Sin emojis** en interfaces ni componentes.
- **Estructura limpia**: Basada en bordes sutiles y espaciados calculados en lugar de sombras pesadas (`box-shadow`).

---

## 3. Estructura del Proyecto

```text
src/
├── app/
│   ├── layouts/
│   │   ├── AuthLayout.tsx                 # Layout sobrio de autenticación
│   │   └── DashboardLayout.tsx            # Header multi-tenant, Sidebar y Outlet
│   ├── providers/
│   │   ├── AppProviders.tsx               # Wrapper general
│   │   ├── TenantProvider.tsx             # Contexto de empresa y número activo
│   │   └── ThemeProvider.tsx              # Tema corporativo
│   └── routes/
│       ├── guards/
│       │   ├── ProtectedRoute.tsx         # Protección con token
│       │   └── GuestRoute.tsx             # Redirección de usuarios autenticados
│       ├── index.tsx                      # RouterProvider
│       └── routes.tsx                     # Declaración completa de rutas
│
├── features/
│   ├── auth/                              # Login y sesión
│   ├── dashboard/                         # KPIs, estado de números, gráficos
│   ├── inbox/                             # Chat en vivo (Bot / Agente / Cliente)
│   ├── contacts/                          # Directorio de clientes, notas y tags
│   ├── whatsapp/                          # Gestión de números WABA, QR pairing
│   ├── automations/                       # Flujos y reglas de respuesta del bot
│   ├── campaigns/                         # Campañas de mensajería masiva
│   ├── analytics/                         # Métricas detalladas y reportes SVG
│   ├── team/                              # Usuarios, roles y permisos de línea
│   └── billing/                           # Cuotas de uso y plan contratado
│
├── infrastructure/
│   ├── http/
│   │   ├── api-client.ts                  # Cliente HTTP listo para producción
│   │   └── api-error.ts                   # Clase de error normalizada
│   ├── realtime/
│   │   └── websocket-client.ts            # Contrato WebSocket para eventos WABA
│   └── storage/
│       └── local-storage.ts               # Persistencia de tenant y sesión
│
├── mocks/
│   ├── data/                              # Datasets tipados e independientes
│   ├── generators/                        # Utilidades para seeds y fechas
│   ├── mock-api.ts                        # Simulación con latencia y filtros estrictos
│   └── mock-realtime.ts                   # Emisor de eventos periódicos en vivo
│
└── shared/
    ├── components/
    │   ├── charts/                        # BarChart, LineChart, DonutChart (SVG puro)
    │   ├── feedback/                      # Spinner, EmptyState, Alert
    │   └── ui/                            # Componentes atómicos
    ├── hooks/
    │   ├── useTenant.ts                   # Hook de acceso al contexto multi-tenant
    │   └── useRealtimeChannel.ts          # Suscripción transparente a eventos
    └── utils/
        └── formatters.ts                  # Formato de fechas, números y monedas
```

---

## 4. Simulación en Tiempo Real

El sistema cuenta con un motor de eventos en memoria (`src/mocks/mock-realtime.ts`):
- Genera mensajes entrantes periódicos simulando clientes reales.
- Se activa o pausa directamente desde el interruptor **"Tiempo Real: ACTIVO / PAUSADO"** ubicado en el encabezado superior.
- Notifica a la bandeja de entrada mediante `useRealtimeChannel('new_message', ...)` actualizando los contadores de no leídos y el chat en pantalla.

---

## 5. Guía de Migración: De Mocks a Backend Real (Swap Guide)

El proyecto fue diseñado bajo el principio de **Inversión de Dependencias (SOLID)** para que la conexión a un backend real no requiera refactorizar ninguna pantalla, componente ni tipo.

### Variables de Entorno (`.env`)
Para activar la conexión con el servidor backend real, actualice:
```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=https://api.tudominio.com/v1
VITE_WS_URL=wss://api.tudominio.com/realtime
```

### Archivos a Modificar en el Swap:
1. **`src/features/*/api/*.api.ts`**:
   Cambiar la llamada interna de `mockApi.*` por `apiClient.*`. Las firmas y los tipos de retorno permanecen 100% idénticos.
   
   *Ejemplo antes:*
   ```typescript
   export const inboxApi = {
     async getConversaciones(empresaId: string, numeroId: string): Promise<ConversacionMock[]> {
       return mockApi.getConversaciones(empresaId, numeroId);
     },
   };
   ```

   *Ejemplo después:*
   ```typescript
   import { apiClient } from '@/infrastructure/http/api-client';

   export const inboxApi = {
     async getConversaciones(empresaId: string, numeroId: string): Promise<ConversacionMock[]> {
       return apiClient.get<ConversacionMock[]>('/conversations', { empresaId, numeroId });
     },
   };
   ```

2. **`src/shared/hooks/useRealtimeChannel.ts`**:
   Al configurar `VITE_USE_MOCKS=false`, el hook ya conmuta automáticamente hacia `webSocketClient.subscribe`, consumiendo los eventos del servidor WebSocket real.

### Archivos que NO deben tocarse:
- ❌ **Páginas y Vistas** (`src/features/*/pages/*`)
- ❌ **Componentes de UI** (`src/features/*/components/*`, `src/shared/components/*`)
- ❌ **Modelos y Tipos** (`src/features/*/types/*`)
- ❌ **Layouts y Rutas** (`src/app/layouts/*`, `src/app/routes/*`)

---

## 6. Contrato de Integración WhatsApp Cloud API

### Estados del Número de Teléfono
- `conectado`: Línea activa con webhook Meta verificado y saludable.
- `pendiente_verificacion`: Registro de certificado o PIN de 2 pasos pendiente ante Meta.
- `desconectado`: Fallo de token WABA o desconexión intencional.

### Tipos de Remitente en Mensajes
- `customer`: Mensaje entrante del cliente final por WhatsApp.
- `bot`: Respuesta automática originada por el motor de reglas o IA del CRM.
- `agent`: Mensaje redactado y enviado por un operador humano autenticado.

---

## 7. Ejecución y Compilación

### Modo Desarrollo
```bash
npm run dev
```

### Compilación para Producción
```bash
npm run build
```
Genera el bundle optimizado en la carpeta `dist/` validando tipos y dependencias mediante `tsc -b`.
