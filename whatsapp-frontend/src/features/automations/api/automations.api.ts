import { mockApi } from '../../../mocks/mock-api';
import { AutomatizacionMock } from '../types/automations.types';

export const automationsApi = {
  async getAutomatizaciones(empresaId: string, numeroId: string): Promise<AutomatizacionMock[]> {
    return mockApi.getAutomatizaciones(empresaId, numeroId);
  },

  async toggleAutomatizacion(empresaId: string, autoId: string, activo: boolean): Promise<AutomatizacionMock> {
    return mockApi.toggleAutomatizacion(empresaId, autoId, activo);
  },
};

