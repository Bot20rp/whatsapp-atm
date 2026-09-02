export interface NumeroMock {
  id: string;
  empresaId: string;
  numero: string;
  alias: string;
  estado: 'conectado' | 'desconectado' | 'pendiente_verificacion';
  calidad: 'alta' | 'media' | 'baja';
  limiteDiario: number;
  mensajesHoy: number;
  esPrincipal: boolean;
  metaWabaId: string;
}

export const NUMEROS_MOCK: NumeroMock[] = [
  // Novatech Soluciones B2B
  {
    id: 'num_nova_ventas',
    empresaId: 'emp_novatech',
    numero: '+54 9 11 5829-1029',
    alias: 'Ventas Corporativas',
    estado: 'conectado',
    calidad: 'alta',
    limiteDiario: 10000,
    mensajesHoy: 1420,
    esPrincipal: true,
    metaWabaId: 'waba_109283746192',
  },
  {
    id: 'num_nova_soporte',
    empresaId: 'emp_novatech',
    numero: '+54 9 11 4091-8832',
    alias: 'Soporte Técnico N2',
    estado: 'conectado',
    calidad: 'alta',
    limiteDiario: 5000,
    mensajesHoy: 840,
    esPrincipal: false,
    metaWabaId: 'waba_293847561029',
  },
  {
    id: 'num_nova_facturacion',
    empresaId: 'emp_novatech',
    numero: '+54 9 11 6301-4410',
    alias: 'Cobranzas y Facturación',
    estado: 'desconectado',
    calidad: 'media',
    limiteDiario: 2000,
    mensajesHoy: 0,
    esPrincipal: false,
    metaWabaId: 'waba_482910482019',
  },

  // Andina Logística Integral
  {
    id: 'num_andina_atencion',
    empresaId: 'emp_andina',
    numero: '+57 312 890-4412',
    alias: 'Atención al Cliente Nacional',
    estado: 'conectado',
    calidad: 'alta',
    limiteDiario: 5000,
    mensajesHoy: 630,
    esPrincipal: true,
    metaWabaId: 'waba_839201928471',
  },
  {
    id: 'num_andina_despachos',
    empresaId: 'emp_andina',
    numero: '+57 318 445-9920',
    alias: 'Monitoreo de Envíos & Flota',
    estado: 'conectado',
    calidad: 'media',
    limiteDiario: 3000,
    mensajesHoy: 310,
    esPrincipal: false,
    metaWabaId: 'waba_994820192840',
  },
  {
    id: 'num_andina_aduanas',
    empresaId: 'emp_andina',
    numero: '+57 320 119-0033',
    alias: 'Comercio Exterior y Aduanas',
    estado: 'pendiente_verificacion',
    calidad: 'alta',
    limiteDiario: 1000,
    mensajesHoy: 0,
    esPrincipal: false,
    metaWabaId: 'waba_773910293840',
  },
];

