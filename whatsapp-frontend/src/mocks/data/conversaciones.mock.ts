export interface ConversacionMock {
  id: string;
  empresaId: string;
  numeroId: string;
  contactoId: string;
  contactoNombre: string;
  contactoTelefono: string;
  ultimoMensaje: string;
  ultimoMensajeTimestamp: string;
  noLeidos: number;
  estado: 'bot' | 'human' | 'closed';
  agenteAsignadoId: string | null;
  agenteAsignadoNombre: string | null;
  etiquetas: string[];
}

export const CONVERSACIONES_MOCK: ConversacionMock[] = [
  // Novatech - Ventas Corporativas (num_nova_ventas)
  {
    id: 'conv_nova_v1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    contactoId: 'cnt_nova_1',
    contactoNombre: 'Valeria Gómez',
    contactoTelefono: '+54 9 11 9876-5432',
    ultimoMensaje: 'Perfecto, coordinamos la demo para el próximo jueves a las 15:00 hs.',
    ultimoMensajeTimestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    noLeidos: 0,
    estado: 'human',
    agenteAsignadoId: 'user_nova_1',
    agenteAsignadoNombre: 'Carlos Morales',
    etiquetas: ['Demo Agendada', 'Enterprise'],
  },
  {
    id: 'conv_nova_v2',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    contactoId: 'cnt_nova_2',
    contactoNombre: 'Martín Paredes',
    contactoTelefono: '+54 9 11 8844-2211',
    ultimoMensaje: 'He recibido tu solicitud. El valor para 50 puestos con soporte prioritario es de USD 1.200/mes.',
    ultimoMensajeTimestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    noLeidos: 1,
    estado: 'bot',
    agenteAsignadoId: null,
    agenteAsignadoNombre: null,
    etiquetas: ['Cotización', 'Bot Activo'],
  },
  {
    id: 'conv_nova_v3',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    contactoId: 'cnt_nova_3',
    contactoNombre: 'Federico Rossi',
    contactoTelefono: '+54 9 11 3322-1199',
    ultimoMensaje: 'Documentación legal recibida. Caso cerrado satisfactoriamente.',
    ultimoMensajeTimestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    noLeidos: 0,
    estado: 'closed',
    agenteAsignadoId: 'user_nova_1',
    agenteAsignadoNombre: 'Carlos Morales',
    etiquetas: ['Contrato Firmado'],
  },

  // Novatech - Soporte Técnico (num_nova_soporte)
  {
    id: 'conv_nova_s1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_soporte',
    contactoId: 'cnt_nova_4',
    contactoNombre: 'Carolina Méndez',
    contactoTelefono: '+54 9 11 4455-6677',
    ultimoMensaje: 'Estamos revisando los registros de sincronización de la API. Le informaremos a la brevedad.',
    ultimoMensajeTimestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    noLeidos: 2,
    estado: 'human',
    agenteAsignadoId: 'user_nova_2',
    agenteAsignadoNombre: 'Mariana Ríos',
    etiquetas: ['Ticket #4910', 'Prioridad Alta'],
  },

  // Andina Logística - Atención al Cliente (num_andina_atencion)
  {
    id: 'conv_andina_a1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    contactoId: 'cnt_andina_1',
    contactoNombre: 'Alejandro Morales',
    contactoTelefono: '+57 310 998-1122',
    ultimoMensaje: 'El contenedor CMAU849201 arribó a puerto Buenaventura hoy a las 06:30.',
    ultimoMensajeTimestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    noLeidos: 0,
    estado: 'human',
    agenteAsignadoId: 'user_andina_1',
    agenteAsignadoNombre: 'Julián Castro',
    etiquetas: ['Carga Marítima', 'Buenaventura'],
  },
  {
    id: 'conv_andina_a2',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    contactoId: 'cnt_andina_2',
    contactoNombre: 'Diana Marcela Torres',
    contactoTelefono: '+57 315 224-8890',
    ultimoMensaje: 'Por favor seleccione la opción correspondiente: 1. Cotizaciones, 2. Estado de Envío, 3. Hablar con Asesor.',
    ultimoMensajeTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    noLeidos: 1,
    estado: 'bot',
    agenteAsignadoId: null,
    agenteAsignadoNombre: null,
    etiquetas: ['Menu Principal', 'Bot'],
  },

  // Andina Logística - Monitoreo de Envíos (num_andina_despachos)
  {
    id: 'conv_andina_d1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_despachos',
    contactoId: 'cnt_andina_3',
    contactoNombre: 'Hernán Silva',
    contactoTelefono: '+57 300 445-6611',
    ultimoMensaje: 'Camión placa TKR-901 en ruta hacia Cali, tiempo estimado de entrega: 4 horas.',
    ultimoMensajeTimestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    noLeidos: 0,
    estado: 'human',
    agenteAsignadoId: 'user_andina_1',
    agenteAsignadoNombre: 'Julián Castro',
    etiquetas: ['Despacho en Ruta'],
  },
];

