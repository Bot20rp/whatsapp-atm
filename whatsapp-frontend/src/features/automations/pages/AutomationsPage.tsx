import React, { useState, useEffect, useCallback } from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { automationsApi } from '../api/automations.api';
import { AutomatizacionMock } from '../types/automations.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Switch } from '../../../shared/components/ui/switch';

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
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Flujos y Automatizaciones del Bot</CardTitle>
            <CardDescription className="text-xs">
              Reglas de respuesta activa para la línea <strong className="text-emerald-400">{numeroActual?.alias}</strong> ({empresaActual?.nombre})
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Motor de IA / Reglas:</span>
            <Badge variant="success" className="font-bold">
              OPERATIVO
            </Badge>
          </div>
        </CardContent>
      </Card>

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
            <Card
              key={regla.id}
              className={regla.activo ? 'border-slate-800' : 'border-slate-800/50 opacity-60 bg-slate-900/40'}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${
                        regla.activo
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{regla.nombre}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{regla.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right text-xs">
                      <div className="text-slate-400 font-medium">Disparos hoy:</div>
                      <div className="font-bold text-white">{regla.ejecucionesHoy} ejecuciones</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={regla.activo}
                        onCheckedChange={() => handleToggle(regla)}
                      />
                      <span className="text-xs font-bold text-slate-300">
                        {regla.activo ? 'ACTIVA' : 'INACTIVA'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Flow Representation */}
                <div className="mt-4 flex flex-col md:flex-row items-center gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex-1 bg-slate-900 p-3 rounded-lg border border-slate-800 w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Disparador (Trigger)
                    </span>
                    <span className="text-white font-semibold">{regla.disparador}</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-purple-400 shrink-0 hidden md:block" />

                  <div className="flex-1 bg-slate-900 p-3 rounded-lg border border-slate-800 w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Acción Ejecutada
                    </span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10">
                      {regla.tipoAccion.replace('_', ' ')}
                    </Badge>
                  </div>

                  <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0 hidden md:block" />

                  <div className="flex-1 bg-slate-900 p-3 rounded-lg border border-slate-800 w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Tasa de Éxito SLA
                    </span>
                    <span className="text-emerald-400 font-extrabold text-sm">{regla.tasaExito}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationsPage;
