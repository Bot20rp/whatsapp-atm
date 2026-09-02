import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useTenant } from '../../../shared/hooks/useTenant';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('carlos.morales@corporativo.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { empresasDisponibles, cambiarEmpresa } = useTenant();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await authApi.login(email);

      if (selectedTenantId) {
        await cambiarEmpresa(selectedTenantId);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-md font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Correo Electrónico Corporativo
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] font-medium"
          placeholder="usuario@empresa.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] font-medium"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Empresa / Organización Principal
        </label>
        <select
          value={selectedTenantId}
          onChange={(e) => setSelectedTenantId(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] font-medium"
        >
          <option value="">Selección automática por defecto</option>
          {empresasDisponibles.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre} ({emp.plan.toUpperCase()})
            </option>
          ))}
        </select>
        <span className="text-[10px] text-slate-500 mt-1 block">
          Podrás alternar entre empresas en cualquier momento desde la barra superior.
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-[#008069] hover:bg-[#006654] text-white text-xs font-black rounded-md border-none transition-colors mt-2 shadow-sm"
      >
        {loading ? 'Accediendo...' : 'Iniciar Sesión'}
      </button>

      <div className="pt-2 text-center">
        <span className="text-[11px] text-slate-500 font-medium">
          Modo Demo Multi-Tenant activo. No se requieren credenciales reales.
        </span>
      </div>
    </form>
  );
};

export default LoginPage;
