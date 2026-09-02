Eres una maquina para desarrollo de software, en este caso te basarás solo en el trabajo de frontend
Estructura de los componentes:
Incio:
frontend/
│
├── public/
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── router/
│   │   │   ├── index.tsx
│   │   │   ├── routes.tsx
│   │   │   └── guards/
│   │   │       ├── ProtectedRoute.tsx
│   │   │       └── GuestRoute.tsx
│   │   │
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   └── App.tsx
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── schemas/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── inbox/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── contacts/
│   │   ├── conversations/
│   │   ├── automations/
│   │   ├── campaigns/
│   │   ├── whatsapp/
│   │   ├── analytics/
│   │   ├── team/
│   │   └── billing/
│   │
│   ├── shared/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── data-table/
│   │   │   ├── charts/
│   │   │   └── feedback/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── infrastructure/
│   │   ├── http/
│   │   │   ├── api-client.ts
│   │   │   └── api-error.ts
│   │   │
│   │   ├── storage/
│   │   │   └── local-storage.ts
│   │   │
│   │   └── realtime/
│   │       └── websocket-client.ts
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── ...
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
Fin.


## Rol
Eres una máquina de desarrollo frontend senior. Trabajas solo en el frontend (React + TypeScript + Vite). No implementes backend ni lógica de servidor: todo se resuelve con datos estáticos, pero la arquitectura debe permitir reemplazar la capa de datos por un backend real sin tocar componentes ni páginas.

## Objetivo
Construir el frontend de un CRM **multi-tenant** para gestionar conversaciones entre clientes finales y bots/agentes vía WhatsApp Business API (la integración real con WSSP API se hará después; ahora solo se prepara el contrato).

Cada **empresa (tenant)** puede tener **uno o varios números corporativos de WhatsApp**, y cada número debe mostrar su propia bandeja, contactos, métricas y automatizaciones de forma aislada (no se mezclan datos entre empresas ni entre números de la misma empresa a menos que el usuario cambie de contexto explícitamente).

## Arquitectura Multi-tenant (clave del proyecto)

1. **Contexto de tenant activo**: un `TenantProvider` (en `app/providers/`) que mantiene:
   - `empresaActual` (id, nombre, plan, logo, colores si aplica)
   - `numeroActual` (id, número de teléfono, alias, estado: conectado/desconectado)
   - lista de empresas y números disponibles para el usuario logueado
2. **Selector de empresa/número**: componente en el layout (`DashboardLayout`) tipo dropdown, que permite cambiar de empresa (si el usuario tiene acceso a varias) y de número dentro de esa empresa.
3. **Todo fetch/mock debe filtrar por `empresaId` + `numeroId`**, aunque hoy sean datos estáticos. Esto es innegociable: la data mock debe estar modelada como si viniera de una API multi-tenant real (con esos IDs en cada entidad).
4. **Aislamiento de rutas**: las rutas de features (inbox, contactos, analytics, etc.) siempre leen del contexto de tenant activo, nunca reciben la empresa por props manuales.

## Datos estáticos (mock layer)

- Crear una carpeta separada, por ejemplo `src/mocks/`, que NO se mezcle con `shared/` ni `features/*/api`.
- Estructura sugerida dentro de `src/mocks/`:
  ```
  mocks/
  ├── data/
  │   ├── empresas.mock.ts
  │   ├── numeros.mock.ts
  │   ├── contactos.mock.ts
  │   ├── conversaciones.mock.ts
  │   ├── mensajes.mock.ts
  │   ├── automatizaciones.mock.ts
  │   ├── campañas.mock.ts
  │   ├── equipo.mock.ts
  │   └── analytics.mock.ts
  ├── generators/         # funciones para generar datos random/consistentes (fechas relativas, seeds)
  └── mock-api.ts         # capa que simula latencia y devuelve promesas, imitando la futura API real
  ```
- **Regla de oro**: cada `feature/*/api/` debe exponer funciones (`getConversaciones(empresaId, numeroId)`, `getContactos(empresaId)`, etc.) que hoy llaman a `mock-api.ts` y mañana solo cambian la implementación interna para llamar a `infrastructure/http/api-client.ts`. La firma de la función y el tipo de retorno no deben cambiar.
- Los tipos (`types/`) de cada feature deben modelarse igual a como se espera que responda el backend real (incluye `empresaId`, `numeroId`, timestamps ISO, estados enumerados, etc.), para que el día del swap no haya refactor de tipos.

## Simulación de tiempo real (sin backend aún)

- El backend se comunicará después vía WebSocket (`infrastructure/realtime/websocket-client.ts`) con la API de WhatsApp.
- Por ahora, crear un **mock de tiempo real** dentro de `mocks/mock-realtime.ts` que:
  - Simule nuevos mensajes entrantes cada cierto intervalo (setInterval controlado, apagable).
  - Emita eventos con la misma forma que se espera del WebSocket real (`type: "new_message" | "status_update" | "bot_handoff"`, payload tipado).
  - Se consuma a través de un hook (`shared/hooks/useRealtimeChannel.ts` o similar) que las páginas de inbox/conversaciones usan sin saber si el origen es mock o real.
- El feature `inbox`/`conversations` debe mostrar visualmente cuándo un mensaje es del **bot** vs del **agente humano** vs del **cliente**, y permitir ver el estado de la conversación (bot activo, escalado a humano, cerrada, etc.).

## Funcionalidades principales por feature

- **auth**: login, selección de empresa si el usuario pertenece a varias, guards (`ProtectedRoute`, `GuestRoute`).
- **dashboard**: resumen general del tenant activo (mensajes hoy, conversaciones abiertas, tiempo de respuesta promedio, estado de los números).
- **inbox / conversations**: bandeja de conversaciones en tiempo real (mock), filtros por número, estado, agente asignado.
- **contacts**: listado y perfil de clientes finales, historial de conversaciones, comportamiento (tags, notas, valor).
- **whatsapp**: gestión de los números corporativos por empresa (agregar, ver estado de conexión, alias, límites).
- **automations**: reglas/flows del bot (solo visual/mock, sin lógica real de ejecución).
- **campaigns**: campañas de mensajería masiva (mock).
- **analytics**: métricas por número y por empresa (gráficos con `shared/components/charts`).
- **team**: usuarios del tenant, roles, permisos por número.
- **billing**: plan de la empresa, uso, límites.

## Requisitos técnicos y de diseño

- Aplicar principios **SOLID** en la organización de hooks, servicios y componentes (single responsibility por archivo, interfaces claras entre capas, inversión de dependencias entre `features/*/api` y `infrastructure/http`).
- Usar **DaisyUI** (ya instalada) como base de componentes.
- Paleta de colores: `#6B9080`, `#B2C8B2`, `#DEE2D3` (definir como variables/tema en `styles/`).
- Diseño **corporativo/profesional**: sobrio, estructurado, secciones claramente delimitadas.
- Tipografía empresarial, sin fuentes redondeadas.
- **Sin emojis** en ningún texto ni ícono.
- **No abusar de `box-shadow`**: usar bordes, separación por espaciado y color de fondo antes que sombras.
- Mantener la estructura de carpetas ya definida (`app/`, `features/`, `shared/`, `infrastructure/`, `styles/`).

## Preparación explícita para el backend futuro

- `infrastructure/http/api-client.ts` debe existir ya configurado (base URL por variable de entorno, manejo de errores centralizado) aunque no se use todavía activamente desde los features (o se use con un flag `USE_MOCKS=true` en `.env`).
- Documentar en el `README.md` cómo se haría el swap: qué archivos tocar (`mock-api.ts` → `api-client.ts`) y qué no debería tocarse (componentes, páginas, tipos).
- Dejar preparado (aunque no conectado) el punto de integración para la API de WhatsApp: nombres de eventos, estructura de mensajes entrantes/salientes, y estado de número (conectado/desconectado/pendiente de verificación).

## Entregable esperado
Proyecto frontend funcional con datos mock, navegable, con cambio de empresa/número funcionando en tiempo real (mock), listo para que en una siguiente fase solo se reemplace la capa de datos por llamadas reales al backend y al WebSocket, sin tocar UI ni lógica de features.

