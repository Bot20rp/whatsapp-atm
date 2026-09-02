import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { analyticsApi } from '../api/analytics.api';
import { AnalyticsMock } from '../types/analytics.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { LineChart } from '../../../shared/components/charts/LineChart';
import { DonutChart } from '../../../shared/components/charts/DonutChart';
import { formatNumber } from '../../../shared/utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { empresaActual, numeroActual } = useTenant();
  const [analytics, setAnalytics] = useState<AnalyticsMock | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!empresaActual || !numeroActual) return;
    try {
      setLoading(true);
      const res = await analyticsApi.getAnalytics(empresaActual.id, numeroActual.id);
      setAnalytics(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id, numeroActual?.id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (loading || !analytics) {
    return <Spinner text="Generando reportes analíticos..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">Analítica de Mensajería & Rendimiento</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Tenant: <strong className="text-slate-900">{empresaActual?.nombre}</strong> • Línea: <strong className="text-[#008069]">{numeroActual?.alias}</strong> ({numeroActual?.numero})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Rango Temporal:</span>
          <span className="font-extrabold text-white bg-[#008069] px-3 py-1 rounded-md shadow-xs">
            Últimos 7 días
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs">
          <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total Mensajes Hoy</span>
          <div className="mt-1.5 text-3xl font-black text-emerald-700">
            {formatNumber(analytics.totalMensajesHoy)}
          </div>
          <span className="text-[11px] text-emerald-800 font-bold mt-1 block">Tasa de entrega verificada: 98.4%</span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs">
          <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Tiempo Medio SLA</span>
          <div className="mt-1.5 text-3xl font-black text-blue-700">
            {analytics.tiempoRespuestaPromedioSegundos} seg
          </div>
          <span className="text-[11px] text-blue-800 font-bold mt-1 block">Dentro del estándar de calidad</span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-600 rounded-lg p-5 shadow-xs">
          <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Resolución Automática Bot</span>
          <div className="mt-1.5 text-3xl font-black text-purple-700">
            {analytics.tasaResolucionBot}%
          </div>
          <span className="text-[11px] text-purple-800 font-bold mt-1 block">Derivados a agentes: {analytics.tasaResolucionHumano}%</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
            Volumen Semanal de Mensajes
          </h3>
          <BarChart data={analytics.mensajesPorDia} height={220} barColor="#008069" />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
            Distribución Horaria del Tráfico
          </h3>
          <LineChart data={analytics.volumenPorHora} height={220} lineColor="#2563EB" fillColor="#DBEAFE" />
        </div>
      </div>

      {/* Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
            Resolución por Canal: Bot vs Asesor Humano
          </h3>
          <DonutChart
            segments={[
              { label: 'Bot Inteligente', porcentaje: analytics.tasaResolucionBot, color: '#7C3AED' },
              { label: 'Asesor Humano', porcentaje: analytics.tasaResolucionHumano, color: '#008069' },
            ]}
            size={160}
            centerText={`${analytics.tasaResolucionBot}%`}
            centerSubtext="Bot"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
            Distribución de Origen
          </h3>
          <DonutChart
            segments={[
              { label: 'WhatsApp Cloud API', porcentaje: 85, color: '#008069' },
              { label: 'Chat Web Sincronizado', porcentaje: 15, color: '#2563EB' },
            ]}
            size={160}
            centerText="WABA"
            centerSubtext="Principal"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
