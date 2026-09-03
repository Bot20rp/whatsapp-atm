export interface ContactoMock {
  id: string;
  empresaId: string;
  nombre: string;
  telefono: string;
  email: string;
  organizacion: string;
  tags: string[];
  notas: string;
  estado: 'activo' | 'prospecto' | 'bloqueado';
  origen: 'whatsapp' | 'web' | 'referido';
  fechaCreacion: string;
}

export const CONTACTOS_MOCK: ContactoMock[] = [
  {
    id: 'cnt_nova_wa_76672191', empresaId: 'emp_novatech', nombre: 'Contacto WhatsApp 76672191',
    telefono: '+591 76672191', email: '', organizacion: '', tags: ['WhatsApp'], notas: '',
    estado: 'activo', origen: 'whatsapp', fechaCreacion: new Date().toISOString(),
  },
  {
    id: 'cnt_nova_wa_65936111', empresaId: 'emp_novatech', nombre: 'Contacto WhatsApp 65936111',
    telefono: '+591 65936111', email: '', organizacion: '', tags: ['WhatsApp'], notas: '',
    estado: 'activo', origen: 'whatsapp', fechaCreacion: new Date().toISOString(),
  },
  // Contactos Novatech
  {
    id: 'cnt_nova_1',
    empresaId: 'emp_novatech',
    nombre: 'Valeria Gómez',
    telefono: '+54 9 11 9876-5432',
    email: 'valeria.gomez@corporacion-sur.com',
    organizacion: 'Corporación Sur S.A.',
    tags: ['Cliente VIP', 'Enterprise', 'Renovación Q3'],
    notas: 'Requiere soporte técnico con SLA de 2 horas. Contacto prioritario.',
    estado: 'activo',
    origen: 'whatsapp',
    fechaCreacion: '2025-02-10T14:20:00.000Z',
  },
  {
    id: 'cnt_nova_2',
    empresaId: 'emp_novatech',
    nombre: 'Martín Paredes',
    telefono: '+54 9 11 8844-2211',
    email: 'mparedes@distribuidorapampa.com.ar',
    organizacion: 'Distribuidora Pampa',
    tags: ['Prospecto', 'Cotización Enviada'],
    notas: 'Interesado en licenciamiento para 50 puestos.',
    estado: 'prospecto',
    origen: 'web',
    fechaCreacion: '2025-02-14T09:10:00.000Z',
  },
  {
    id: 'cnt_nova_3',
    empresaId: 'emp_novatech',
    nombre: 'Federico Rossi',
    telefono: '+54 9 11 3322-1199',
    email: 'f.rossi@bancoplata.com.ar',
    organizacion: 'Banco Plata',
    tags: ['Cliente VIP', 'Finanzas', 'API WABA'],
    notas: 'Integración vía webhook pendiente de aprobación de seguridad.',
    estado: 'activo',
    origen: 'referido',
    fechaCreacion: '2025-01-20T11:45:00.000Z',
  },
  {
    id: 'cnt_nova_4',
    empresaId: 'emp_novatech',
    nombre: 'Carolina Méndez',
    telefono: '+54 9 11 4455-6677',
    email: 'cmendez@grupoindustria.com',
    organizacion: 'Grupo Industria Argentina',
    tags: ['Soporte N2', 'Ticket Abierto'],
    notas: 'Reporta lentitud en sincronización de contactos.',
    estado: 'activo',
    origen: 'whatsapp',
    fechaCreacion: '2025-02-01T16:00:00.000Z',
  },

  // Contactos Andina Logística
  {
    id: 'cnt_andina_1',
    empresaId: 'emp_andina',
    nombre: 'Alejandro Morales',
    telefono: '+57 310 998-1122',
    email: 'amorales@importadoracol.com',
    organizacion: 'Importadora Colombia Express',
    tags: ['Contrato Anual', 'Carga Refrigerada'],
    notas: 'Envíos semanales desde Buenaventura a Bogotá.',
    estado: 'activo',
    origen: 'whatsapp',
    fechaCreacion: '2025-02-05T08:30:00.000Z',
  },
  {
    id: 'cnt_andina_2',
    empresaId: 'emp_andina',
    nombre: 'Diana Marcela Torres',
    telefono: '+57 315 224-8890',
    email: 'diana.torres@textilesandinos.co',
    organizacion: 'Textiles Andinos S.A.S.',
    tags: ['Prospecto', 'Licitación 2025'],
    notas: 'Cotización solicitada para transporte terrestre nacional.',
    estado: 'prospecto',
    origen: 'referido',
    fechaCreacion: '2025-02-18T12:00:00.000Z',
  },
  {
    id: 'cnt_andina_3',
    empresaId: 'emp_andina',
    nombre: 'Hernán Silva',
    telefono: '+57 300 445-6611',
    email: 'hsilva@agroinsumos.com.co',
    organizacion: 'Agroinsumos del Valle',
    tags: ['Despacho Urgente', 'Rastreo Activo'],
    notas: 'Requiere guía de transporte #GUIA-88492 actualizada.',
    estado: 'activo',
    origen: 'whatsapp',
    fechaCreacion: '2025-02-22T10:15:00.000Z',
  },
];

