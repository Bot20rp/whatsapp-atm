export interface MetricPoint {
  label: string;
  valor: number;
}

export interface AnalyticsMock {
  empresaId: string;
  numeroId: string;
  totalMensajesHoy: number;
  conversacionesAbiertas: number;
  tiempoRespuestaPromedioSegundos: number;
  tasaResolucionBot: number; // Porcentaje ej 68
  tasaResolucionHumano: number; // Porcentaje ej 32
  mensajesPorDia: MetricPoint[];
  volumenPorHora: MetricPoint[];
  distribucionCanales: { canal: string; porcentaje: number }[];
}

export const ANALYTICS_MOCK: Record<string, AnalyticsMock> = {
  // Novatech - Ventas
  'emp_novatech_num_nova_ventas': {
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    totalMensajesHoy: 1420,
    conversacionesAbiertas: 14,
    tiempoRespuestaPromedioSegundos: 45,
    tasaResolucionBot: 62,
    tasaResolucionHumano: 38,
    mensajesPorDia: [
      { label: 'Lun', valor: 980 },
      { label: 'Mar', valor: 1240 },
      { label: 'Mié', valor: 1420 },
      { label: 'Jue', valor: 1350 },
      { label: 'Vie', valor: 1520 },
      { label: 'Sáb', valor: 410 },
      { label: 'Dom', valor: 220 },
    ],
    volumenPorHora: [
      { label: '08:00', valor: 45 },
      { label: '10:00', valor: 190 },
      { label: '12:00', valor: 260 },
      { label: '14:00', valor: 310 },
      { label: '16:00', valor: 280 },
      { label: '18:00', valor: 180 },
      { label: '20:00', valor: 70 },
    ],
    distribucionCanales: [
      { canal: 'WhatsApp Business API', porcentaje: 85 },
      { canal: 'Web Widget', porcentaje: 15 },
    ],
  },

  // Novatech - Soporte
  'emp_novatech_num_nova_soporte': {
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_soporte',
    totalMensajesHoy: 840,
    conversacionesAbiertas: 8,
    tiempoRespuestaPromedioSegundos: 75,
    tasaResolucionBot: 45,
    tasaResolucionHumano: 55,
    mensajesPorDia: [
      { label: 'Lun', valor: 620 },
      { label: 'Mar', valor: 780 },
      { label: 'Mié', valor: 840 },
      { label: 'Jue', valor: 710 },
      { label: 'Vie', valor: 890 },
      { label: 'Sáb', valor: 210 },
      { label: 'Dom', valor: 95 },
    ],
    volumenPorHora: [
      { label: '08:00', valor: 30 },
      { label: '10:00', valor: 110 },
      { label: '12:00', valor: 140 },
      { label: '14:00', valor: 180 },
      { label: '16:00', valor: 195 },
      { label: '18:00', valor: 120 },
      { label: '20:00', valor: 40 },
    ],
    distribucionCanales: [
      { canal: 'WhatsApp Business API', porcentaje: 95 },
      { canal: 'Web Widget', porcentaje: 5 },
    ],
  },

  // Andina Logística - Atención
  'emp_andina_num_andina_atencion': {
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    totalMensajesHoy: 630,
    conversacionesAbiertas: 9,
    tiempoRespuestaPromedioSegundos: 52,
    tasaResolucionBot: 74,
    tasaResolucionHumano: 26,
    mensajesPorDia: [
      { label: 'Lun', valor: 540 },
      { label: 'Mar', valor: 610 },
      { label: 'Mié', valor: 630 },
      { label: 'Jue', valor: 590 },
      { label: 'Vie', valor: 670 },
      { label: 'Sáb', valor: 310 },
      { label: 'Dom', valor: 140 },
    ],
    volumenPorHora: [
      { label: '08:00', valor: 80 },
      { label: '10:00', valor: 150 },
      { label: '12:00', valor: 110 },
      { label: '14:00', valor: 140 },
      { label: '16:00', valor: 100 },
      { label: '18:00', valor: 40 },
      { label: '20:00', valor: 10 },
    ],
    distribucionCanales: [
      { canal: 'WhatsApp Business API', porcentaje: 100 },
    ],
  },
};

