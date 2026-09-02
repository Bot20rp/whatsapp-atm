import { mockApi } from '../../../mocks/mock-api';
import { AnalyticsMock } from '../../../mocks/data/analytics.mock';
import { NumeroMock } from '../../../mocks/data/numeros.mock';

export const dashboardApi = {
  async getDashboardSummary(empresaId: string, numeroId: string): Promise<{
    analytics: AnalyticsMock;
    numeros: NumeroMock[];
  }> {
    const [analytics, numeros] = await Promise.all([
      mockApi.getAnalytics(empresaId, numeroId),
      mockApi.getNumeros(empresaId),
    ]);

    return { analytics, numeros };
  },
};

