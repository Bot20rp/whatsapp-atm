const KEYS = {
  ACTIVE_EMPRESA_ID: 'crm_active_empresa_id',
  ACTIVE_NUMERO_ID: 'crm_active_numero_id',
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'crm_auth_user',
  REALTIME_ACTIVE: 'crm_realtime_simulation_active',
} as const;

export const storage = {
  getEmpresaId(): string | null {
    return localStorage.getItem(KEYS.ACTIVE_EMPRESA_ID);
  },
  setEmpresaId(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_EMPRESA_ID, id);
  },

  getNumeroId(): string | null {
    return localStorage.getItem(KEYS.ACTIVE_NUMERO_ID);
  },
  setNumeroId(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_NUMERO_ID, id);
  },

  getUser<T>(): T | null {
    const raw = localStorage.getItem(KEYS.AUTH_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser(user: any): void {
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
  },

  getRealtimeActive(): boolean {
    const val = localStorage.getItem(KEYS.REALTIME_ACTIVE);
    return val === null ? true : val === 'true';
  },
  setRealtimeActive(active: boolean): void {
    localStorage.setItem(KEYS.REALTIME_ACTIVE, String(active));
  },

  clearSession(): void {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
    localStorage.removeItem(KEYS.AUTH_USER);
  },
};

