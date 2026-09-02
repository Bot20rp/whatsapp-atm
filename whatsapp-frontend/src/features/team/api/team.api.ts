import { mockApi } from '../../../mocks/mock-api';
import { MiembroEquipoMock } from '../types/team.types';

export const teamApi = {
  async getEquipo(empresaId: string): Promise<MiembroEquipoMock[]> {
    return mockApi.getEquipo(empresaId);
  },
};

