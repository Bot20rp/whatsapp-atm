import { mockApi } from '../../../mocks/mock-api';
import { NumeroMock } from '../types/whatsapp.types';

export const whatsappApi = {
  async getNumeros(empresaId: string): Promise<NumeroMock[]> {
    return mockApi.getNumeros(empresaId);
  },

  async actualizarEstado(
    numeroId: string,
    estado: 'conectado' | 'desconectado' | 'pendiente_verificacion'
  ): Promise<NumeroMock> {
    return mockApi.actualizarEstadoNumero(numeroId, estado);
  },
};

