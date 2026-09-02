import { mockApi } from '../../../mocks/mock-api';
import { AnalyticsMock } from '../types/analytics.types';

export const analyticsApi = {
  async getAnalytics(empresaId: string, numeroId: string): Promise<AnalyticsMock> {
    return mockApi.getAnalytics(empresaId, numeroId);
  },
};

