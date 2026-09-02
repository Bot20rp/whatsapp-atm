import React, { useState, useEffect, useCallback } from 'react';
import { Bot, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { automationsApi } from '../api/automations.api';
import { AutomatizacionMock } from '../types/automations.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';

export const AutomationsPage: React.FC = () => {
  const { empresaActual, numeroActual } = useTenant();
  const [reglas, setReglas] = useState<AutomatizacionMock[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarReglas = useCallback(async () => {
    if (!empresaActual || !numeroActual) return;
    try {
      setLoading(true);
      const res = await automationsApi.getAutomatizaciones(empresaActual.id, numeroActual.id);
      setReglas(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id, numeroActual?.id]);

  useEffect(() => {
    cargarReglas();
  }, [cargarReglas]);

  const handleToggle = async (auto: AutomatizacionMock) => {
    if (!empresaActual) return;
    const nuevoEstado = !auto.activo;
    const updated = await automationsApi.toggleAutomatizacion(empresaActual.id, auto.id, nuevoEstado);
    setReglas((prev) => prev.map((r) => (r.id === auto.id ? updated : r)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">Flujos y Automatizaciones del Bot</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Reglas de respuesta activa para la línea <strong className="text-[#008069]">{numeroActual?.alias}</strong> ({empresaActual?.nombre})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold">Motor de IA / Reglas:</span>
          <span className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-md shadow-xs">
            OPERATIVO
          </span>
        </div>
      </div>

      {/* Rules List */}
      {loading ? (
        <Spinner text="Cargando flujos automatizados..." />
      ) : reglas.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="Sin automatizaciones configuradas"
          description={`No se han registrado flujos para la línea "${numeroActual?.alias}". Cambia de línea o crea una nueva regla.`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reglas.map((regla) => (
            <div
              key={regla.id}
              className={`bg-white border rounded-xl p-5 transition-all shadow-xs ${
                regla.activo ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xs ${
                      regla.activo
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{regla.nombre}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{regla.descripcion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-[11px]">
                    <div className="text-slate-500 font-medium">Ejecuciones hoy:</div>
                    <div className="font-extrabold text-slate-900">{regla.ejecucionesHoy} disparos</div>
                  </div>

                  <button
                    onClick={() => handleToggle(regla)}
                    className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    {regla.activo ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <ToggleRight className="w-8 h-8 text-emerald-600" /> ACTIVA
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <ToggleLeft className="w-8 h-8 text-slate-400" /> INACTIVA
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Visual Flow Representation */}
              <div className="mt-4 flex flex-col md:flex-row items-center gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex-1 bg-white p-3 rounded-md border border-slate-200 w-full shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-0.5">
                    Disparador (Trigger)
                  </span>
                  <span className="text-slate-900 font-bold">{regla.disparador}</span>
                </div>

                <ArrowRight className="w-5 h-5 text-indigo-500 shrink-0 hidden md:block" />

                <div className="flex-1 bg-white p-3 rounded-md border border-slate-200 w-full shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-0.5">
                    Acción Ejecutada
                  </span>
                  <span className="text-indigo-800 font-black uppercase font-mono text-[11px] bg-indigo-50 px-2 py-0.5 rounded">
                    {regla.tipoAccion.replace('_', ' ')}
                  </span>
                </div>

                <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0 hidden md:block" />

                <div className="flex-1 bg-white p-3 rounded-md border border-slate-200 w-full shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-0.5">
                    Tasa de Éxito SLA
                  </span>
                  <span className="text-emerald-700 font-black text-sm">{regla.tasaExito}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationsPage;
