import { mockApi } from '../../../mocks/mock-api';
import { CampañaMock } from '../types/campaigns.types';

export const campaignsApi = {
  async getCampañas(empresaId: string, numeroId: string): Promise<CampañaMock[]> {
    return mockApi.getCampañas(empresaId, numeroId);
  },

  async crearCampaña(
    empresaId: string,
    numeroId: string,
    data: { nombre: string; plantillaMeta: string; audienciaTotal: number }
  ): Promise<CampañaMock> {
    return mockApi.crearCampaña(empresaId, numeroId, data);
  },
};

