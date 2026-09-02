export interface EmpresaMock {
  id: string;
  nombre: string;
  plan: 'starter' | 'pro' | 'enterprise';
  logoIniciales: string;
  identificadorFiscal: string;
  limiteMensajesMensual: number;
  mensajesUsadosMes: number;
  totalNumerosPermitidos: number;
  fechaRegistro: string;
}

export const EMPRESAS_MOCK: EmpresaMock[] = [
  {
    id: 'emp_novatech',
    nombre: 'Novatech Soluciones B2B',
    plan: 'enterprise',
    logoIniciales: 'NT',
    identificadorFiscal: 'RFC: NTS-981214-AA3',
    limiteMensajesMensual: 100000,
    mensajesUsadosMes: 48250,
    totalNumerosPermitidos: 5,
    fechaRegistro: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'emp_andina',
    nombre: 'Andina Logística Integral',
    plan: 'pro',
    logoIniciales: 'AL',
    identificadorFiscal: 'CUIT: 30-71489234-9',
    limiteMensajesMensual: 25000,
    mensajesUsadosMes: 14890,
    totalNumerosPermitidos: 3,
    fechaRegistro: '2025-03-10T10:30:00.000Z',
  },
];

