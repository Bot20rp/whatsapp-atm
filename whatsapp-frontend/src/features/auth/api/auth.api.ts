import { mockApi } from '../../../mocks/mock-api';
import { UserSession } from '../../../shared/types/common.types';

export const authApi = {
  async login(email: string): Promise<{ token: string; user: UserSession }> {
    // In mock mode, we validate and return a mock user
    const empresas = await mockApi.getEmpresas();
    const user: UserSession = {
      id: 'usr_carlos_morales',
      nombre: 'Carlos Morales',
      email: email || 'cmorales@novatech.com',
      rol: 'administrador',
      empresaIds: empresas.map((e) => e.id),
    };

    const token = 'mock_jwt_token_crm_waba_enterprise';
    localStorage.setItem('auth_token', token);
    localStorage.setItem('crm_auth_user', JSON.stringify(user));

    return { token, user };
  },

  getCurrentUser(): UserSession | null {
    const raw = localStorage.getItem('crm_auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};

