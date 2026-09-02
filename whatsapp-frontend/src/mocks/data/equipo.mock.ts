export interface MiembroEquipoMock {
  id: string;
  empresaId: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'supervisor' | 'agente';
  numerosPermitidos: string[]; // IDs de números o ['all']
  estado: 'activo' | 'inactivo';
  conversacionesAtendidasHoy: number;
}

export const EQUIPO_MOCK: MiembroEquipoMock[] = [
  // Novatech
  {
    id: 'user_nova_admin',
    empresaId: 'emp_novatech',
    nombre: 'Gonzalo Benítez',
    email: 'gbenitez@novatech.com',
    rol: 'administrador',
    numerosPermitidos: ['all'],
    estado: 'activo',
    conversacionesAtendidasHoy: 4,
  },
  {
    id: 'user_nova_1',
    empresaId: 'emp_novatech',
    nombre: 'Carlos Morales',
    email: 'cmorales@novatech.com',
    rol: 'agente',
    numerosPermitidos: ['num_nova_ventas'],
    estado: 'activo',
    conversacionesAtendidasHoy: 18,
  },
  {
    id: 'user_nova_2',
    empresaId: 'emp_novatech',
    nombre: 'Mariana Ríos',
    email: 'mrios@novatech.com',
    rol: 'agente',
    numerosPermitidos: ['num_nova_soporte'],
    estado: 'activo',
    conversacionesAtendidasHoy: 12,
  },

  // Andina
  {
    id: 'user_andina_admin',
    empresaId: 'emp_andina',
    nombre: 'Beatriz Salazar',
    email: 'bsalazar@andina.com.co',
    rol: 'administrador',
    numerosPermitidos: ['all'],
    estado: 'activo',
    conversacionesAtendidasHoy: 2,
  },
  {
    id: 'user_andina_1',
    empresaId: 'emp_andina',
    nombre: 'Julián Castro',
    email: 'jcastro@andina.com.co',
    rol: 'agente',
    numerosPermitidos: ['num_andina_atencion', 'num_andina_despachos'],
    estado: 'activo',
    conversacionesAtendidasHoy: 15,
  },
];

