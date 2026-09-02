import { mockApi } from '../../../mocks/mock-api';
import { ContactoMock } from '../types/contacts.types';

export const contactsApi = {
  async getContactos(empresaId: string): Promise<ContactoMock[]> {
    return mockApi.getContactos(empresaId);
  },

  async crearContacto(
    empresaId: string,
    data: Omit<ContactoMock, 'id' | 'empresaId' | 'fechaCreacion'>
  ): Promise<ContactoMock> {
    return mockApi.crearContacto(empresaId, data);
  },

  async actualizarContacto(
    empresaId: string,
    contactoId: string,
    data: Partial<ContactoMock>
  ): Promise<ContactoMock> {
    return mockApi.actualizarContacto(empresaId, contactoId, data);
  },
};

