import { mockApi } from '../../../mocks/mock-api';
import { ConversacionMock, MensajeMock, ContactoMock } from '../types/inbox.types';

export const inboxApi = {
  async getConversaciones(empresaId: string, numeroId: string): Promise<ConversacionMock[]> {
    return mockApi.getConversaciones(empresaId, numeroId);
  },

  async getMensajes(
    empresaId: string,
    numeroId: string,
    conversacionId: string
  ): Promise<MensajeMock[]> {
    return mockApi.getMensajes(empresaId, numeroId, conversacionId);
  },

  async enviarMensaje(
    empresaId: string,
    numeroId: string,
    conversacionId: string,
    contenido: string,
    remitente: 'agent' | 'bot' = 'agent',
    nombreEmisor: string = 'Carlos Morales'
  ): Promise<MensajeMock> {
    return mockApi.enviarMensaje(empresaId, numeroId, conversacionId, contenido, remitente, nombreEmisor);
  },

  async cambiarEstadoConversacion(
    empresaId: string,
    conversacionId: string,
    estado: 'bot' | 'human' | 'closed',
    agente?: { id: string; nombre: string } | null
  ): Promise<ConversacionMock> {
    return mockApi.actualizarEstadoConversacion(empresaId, conversacionId, estado, agente);
  },

  async getContactos(empresaId: string): Promise<ContactoMock[]> {
    return mockApi.getContactos(empresaId);
  },
};

