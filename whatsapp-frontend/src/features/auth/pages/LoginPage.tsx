import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useTenant } from '../../../shared/hooks/useTenant';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select } from '../../../shared/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';
import { MessageSquare, Lock, Mail, Building2 } from 'lucide-react';

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
    <Card className="w-full border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl">WhatsApp CRM Enterprise</CardTitle>
        <CardDescription>
          Inicia sesión para gestionar tus conversaciones multi-tenant
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> Correo Electrónico Corporativo
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Contraseña
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Empresa / Tenant Principal
            </label>
            <Select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
            >
              <option value="">Selección automática por defecto</option>
              {empresasDisponibles.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} ({emp.plan.toUpperCase()})
                </option>
              ))}
            </Select>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Podrás alternar entre empresas en cualquier momento desde la barra superior.
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
            size="lg"
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </Button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Modo Demo Multi-Tenant activo. No se requieren credenciales reales.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
