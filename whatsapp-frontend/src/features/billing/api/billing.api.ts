import { mockApi } from '../../../mocks/mock-api';
import { EmpresaMock } from '../types/billing.types';

export const billingApi = {
  async getPlanActual(empresaId: string): Promise<EmpresaMock> {
    return mockApi.getEmpresaById(empresaId);
  },
};

