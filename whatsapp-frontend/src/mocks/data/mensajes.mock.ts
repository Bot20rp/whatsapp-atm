export interface MensajeMock {
  id: string;
  conversacionId: string;
  empresaId: string;
  numeroId: string;
  remitente: 'customer' | 'bot' | 'agent';
  nombreEmisor: string;
  contenido: string;
  timestamp: string;
  estado: 'enviado' | 'entregado' | 'leido';
  tipo: 'texto' | 'plantilla';
}

export const MENSAJES_MOCK: MensajeMock[] = [
  // Conversación conv_nova_v1 (Valeria Gómez - Ventas Novatech)
  {
    id: 'msg_nv1_1',
    conversacionId: 'conv_nova_v1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'customer',
    nombreEmisor: 'Valeria Gómez',
    contenido: 'Buenos días, quisiéramos evaluar la plataforma para nuestro equipo de 20 personas.',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_nv1_2',
    conversacionId: 'conv_nova_v1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'bot',
    nombreEmisor: 'Bot Asistente Comercial',
    contenido: '¡Hola Valeria! Gracias por escribir a Novatech Soluciones. Un asesor comercial tomará tu conversación en unos instantes.',
    timestamp: new Date(Date.now() - 39 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_nv1_3',
    conversacionId: 'conv_nova_v1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'agent',
    nombreEmisor: 'Carlos Morales',
    contenido: 'Hola Valeria, un gusto saludarte. Te comparto disponibilidad para realizar una demostración técnica.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_nv1_4',
    conversacionId: 'conv_nova_v1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'customer',
    nombreEmisor: 'Valeria Gómez',
    contenido: 'Perfecto, coordinamos la demo para el próximo jueves a las 15:00 hs.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },

  // Conversación conv_nova_v2 (Martín Paredes - Bot Activo)
  {
    id: 'msg_nv2_1',
    conversacionId: 'conv_nova_v2',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'customer',
    nombreEmisor: 'Martín Paredes',
    contenido: 'Hola, requiero lista de precios y cotización para 50 usuarios.',
    timestamp: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_nv2_2',
    conversacionId: 'conv_nova_v2',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_ventas',
    remitente: 'bot',
    nombreEmisor: 'Bot Cotizador',
    contenido: 'He recibido tu solicitud. El valor para 50 puestos con soporte prioritario es de USD 1.200/mes.',
    timestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    estado: 'entregado',
    tipo: 'texto',
  },

  // Conversación conv_nova_s1 (Carolina Méndez - Soporte N2)
  {
    id: 'msg_ns1_1',
    conversacionId: 'conv_nova_s1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_soporte',
    remitente: 'customer',
    nombreEmisor: 'Carolina Méndez',
    contenido: 'Buen día, la sincronización de contactos webhook está demorando más de 10 minutos.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_ns1_2',
    conversacionId: 'conv_nova_s1',
    empresaId: 'emp_novatech',
    numeroId: 'num_nova_soporte',
    remitente: 'agent',
    nombreEmisor: 'Mariana Ríos',
    contenido: 'Estamos revisando los registros de sincronización de la API. Le informaremos a la brevedad.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estado: 'entregado',
    tipo: 'texto',
  },

  // Conversación conv_andina_a1 (Alejandro Morales - Andina Atención)
  {
    id: 'msg_aa1_1',
    conversacionId: 'conv_andina_a1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    remitente: 'customer',
    nombreEmisor: 'Alejandro Morales',
    contenido: 'Buenas tardes, quisiera consultar el estatus del contenedor CMAU849201.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_aa1_2',
    conversacionId: 'conv_andina_a1',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    remitente: 'agent',
    nombreEmisor: 'Julián Castro',
    contenido: 'El contenedor CMAU849201 arribó a puerto Buenaventura hoy a las 06:30.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },

  // Conversación conv_andina_a2 (Diana Torres - Bot Activo)
  {
    id: 'msg_aa2_1',
    conversacionId: 'conv_andina_a2',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    remitente: 'customer',
    nombreEmisor: 'Diana Marcela Torres',
    contenido: 'Hola, información sobre servicios de transporte refrigerado.',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
  {
    id: 'msg_aa2_2',
    conversacionId: 'conv_andina_a2',
    empresaId: 'emp_andina',
    numeroId: 'num_andina_atencion',
    remitente: 'bot',
    nombreEmisor: 'Bot Andina Express',
    contenido: 'Por favor seleccione la opción correspondiente: 1. Cotizaciones, 2. Estado de Envío, 3. Hablar con Asesor.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    estado: 'leido',
    tipo: 'texto',
  },
];

