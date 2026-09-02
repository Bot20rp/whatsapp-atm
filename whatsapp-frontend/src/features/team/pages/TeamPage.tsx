import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Smartphone, CheckCircle2 } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { teamApi } from '../api/team.api';
import { MiembroEquipoMock } from '../types/team.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';

export const TeamPage: React.FC = () => {
  const { empresaActual, numerosDisponibles } = useTenant();
  const [equipo, setEquipo] = useState<MiembroEquipoMock[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarEquipo = useCallback(async () => {
    if (!empresaActual) return;
    try {
      setLoading(true);
      const res = await teamApi.getEquipo(empresaActual.id);
      setEquipo(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id]);

  useEffect(() => {
    cargarEquipo();
  }, [cargarEquipo]);

  const getNombreNumero = (id: string) => {
    if (id === 'all') return 'Todas las líneas autorizadas';
    const n = numerosDisponibles.find((num) => num.id === id);
    return n ? n.alias : id;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">Equipo y Permisos por Línea</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Control de acceso a números WhatsApp de <strong className="text-[#008069]">{empresaActual?.nombre}</strong>
          </p>
        </div>

        <button
          type="button"
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invitar Usuario</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <Spinner text="Cargando miembros del equipo..." />
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Usuario</th>
                <th className="p-3.5">Rol Corporativo</th>
                <th className="p-3.5">Líneas Asignadas</th>
                <th className="p-3.5">Atendidos Hoy</th>
                <th className="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipo.map((m) => (
                <tr key={m.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#008069] text-white flex items-center justify-center font-black shadow-xs">
                        {m.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{m.nombre}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{m.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                      {m.rol}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {m.numerosPermitidos.map((numId, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1"
                        >
                          <Smartphone className="w-3 h-3 text-[#008069]" />
                          {getNombreNumero(numId)}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    {m.conversacionesAtendidasHoy} chats
                  </td>

                  <td className="p-3.5">
                    <span className="flex items-center gap-1 text-[10px] text-white bg-emerald-600 px-2.5 py-0.5 rounded font-black shadow-xs w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
