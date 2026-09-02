import { EmpresaMock } from '../../mocks/data/empresas.mock';
import { NumeroMock } from '../../mocks/data/numeros.mock';

export interface TenantContextType {
  empresaActual: EmpresaMock | null;
  numeroActual: NumeroMock | null;
  empresasDisponibles: EmpresaMock[];
  numerosDisponibles: NumeroMock[];
  cargando: boolean;
  error: string | null;
  cambiarEmpresa: (empresaId: string) => Promise<void>;
  cambiarNumero: (numeroId: string) => void;
  actualizarEstadoNumeroLocal: (numeroId: string, estado: 'conectado' | 'desconectado' | 'pendiente_verificacion') => Promise<void>;
  simulacionEnVivo: boolean;
  toggleSimulacionEnVivo: () => void;
}

export interface UserSession {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'supervisor' | 'agente';
  empresaIds: string[];
}

