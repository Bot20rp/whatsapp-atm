export interface CampañaMock {
  id: string;
  empresaId: string;
  numeroId: string;
  nombre: string;
  plantillaMeta: string;
  audienciaTotal: number;
  enviados: number;
  entregados: number;
  leidos: number;
  fallidos: number;
  estado: 'programada' | 'en_progreso' | 'completada';
  fechaInicio: string;
}

export const CAMPAÑAS_MOCK: CampañaMock[] = [
  // Novatech
  {
    id: 'cmp_nova_1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    nombre: 'Lanzamiento Módulo Analítica Avanzada Q3',
    plantillaMeta: 'product_launch_q3_enterprise',
    audienciaTotal: 1250,
    enviados: 1250,
    entregados: 1210,
    leidos: 980,
    fallidos: 40,
    estado: 'completada',
    fechaInicio: '2025-02-15T14:00:00.000Z',
  },
  {
    id: 'cmp_nova_2',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    nombre: 'Webinar: Escalabilidad en WhatsApp Cloud API',
    plantillaMeta: 'invitation_webinar_march',
    audienciaTotal: 850,
    enviados: 420,
    entregados: 405,
    leidos: 310,
    fallidos: 15,
    estado: 'en_progreso',
    fechaInicio: '2025-03-01T10:00:00.000Z',
  },

  // Andina
  {
    id: 'cmp_andina_1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    nombre: 'Aviso Operativo: Cierre Programado Paso Cordillera',
    plantillaMeta: 'transit_alert_cordillera',
    audienciaTotal: 480,
    enviados: 480,
    entregados: 472,
    leidos: 430,
    fallidos: 8,
    estado: 'completada',
    fechaInicio: '2025-02-28T07:00:00.000Z',
  },
];

