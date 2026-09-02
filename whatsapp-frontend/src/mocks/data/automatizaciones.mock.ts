export interface AutomatizacionMock {
  id: string;
  empresaId: string;
  numeroId: string;
  nombre: string;
  descripcion: string;
  disparador: string;
  tipoAccion: 'respuesta_automatica' | 'escalamiento_humano' | 'asignar_etiqueta' | 'menu_interactivo';
  activo: boolean;
  ejecucionesHoy: number;
  tasaExito: string;
}

export const AUTOMATIZACIONES_MOCK: AutomatizacionMock[] = [
  // Novatech - Ventas
  {
    id: 'auto_nova_1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    nombre: 'Mensaje de Bienvenida Comercial',
    descripcion: 'Responde inmediatamente a prospectos que inician conversación por primera vez.',
    disparador: 'Primer mensaje entrante de nuevo contacto',
    tipoAccion: 'menu_interactivo',
    activo: true,
    ejecucionesHoy: 48,
    tasaExito: '98.5%',
  },
  {
    id: 'auto_nova_2',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    nombre: 'Escalamiento a Asesor Humano',
    descripcion: 'Deriva la conversación a la cola de agentes cuando el usuario solicita una demo o cotización.',
    disparador: 'Palabras clave: "asesor", "demo", "humano", "comprar"',
    tipoAccion: 'escalamiento_humano',
    activo: true,
    ejecucionesHoy: 23,
    tasaExito: '100%',
  },
  {
    id: 'auto_nova_3',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    nombre: 'Respuesta Fuera de Horario Laboral',
    descripcion: 'Informa sobre horarios de atención comercial (Lunes a Viernes 09:00 - 18:00).',
    disparador: 'Mensaje fuera del horario de oficina',
    tipoAccion: 'respuesta_automatica',
    activo: true,
    ejecucionesHoy: 12,
    tasaExito: '99.1%',
  },

  // Novatech - Soporte
  {
    id: 'auto_nova_4',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_soporte',
    nombre: 'Generación Automática de Ticket SLA',
    descripcion: 'Asigna etiqueta y crea ticket en cola de soporte nivel 2.',
    disparador: 'Recepción de palabra clave "error" o "falla"',
    tipoAccion: 'asignar_etiqueta',
    activo: true,
    ejecucionesHoy: 17,
    tasaExito: '97.2%',
  },

  // Andina Logística - Atención
  {
    id: 'auto_andina_1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    nombre: 'Menú de Autoservicio Logístico',
    descripcion: 'Permite consultar estado de guía o cotizar flete de forma interactiva.',
    disparador: 'Cualquier mensaje inicial',
    tipoAccion: 'menu_interactivo',
    activo: true,
    ejecucionesHoy: 89,
    tasaExito: '99.4%',
  },
  {
    id: 'auto_andina_2',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    nombre: 'Derivación Urgente a Despachos',
    descripcion: 'Pasa a asesor cuando el cliente reporta retraso en puerto o siniestro.',
    disparador: 'Palabra clave: "urgente", "retraso", "retenido"',
    tipoAccion: 'escalamiento_humano',
    activo: true,
    ejecucionesHoy: 8,
    tasaExito: '100%',
  },
];

