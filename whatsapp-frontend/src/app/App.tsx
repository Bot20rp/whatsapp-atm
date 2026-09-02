import React, { useEffect } from 'react';
import { AppProviders } from './providers/AppProviders';
import AppRoutes from './routes';

export const App: React.FC = () => {
  // Pre-inicializar sesión demo si no existe para navegación inmediata
  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', 'demo_enterprise_session_token');
      localStorage.setItem(
        'crm_auth_user',
        JSON.stringify({
          id: 'usr_carlos_morales',
          nombre: 'Carlos Morales',
          email: 'cmorales@novatech.com',
          rol: 'administrador',
        })
      );
    }
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;