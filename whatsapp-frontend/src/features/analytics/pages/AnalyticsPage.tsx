import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { analyticsApi } from '../api/analytics.api';
import { AnalyticsMock } from '../types/analytics.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { LineChart } from '../../../shared/components/charts/LineChart';
import { DonutChart } from '../../../shared/components/charts/DonutChart';
import { formatNumber } from '../../../shared/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';

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
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Analítica de Mensajería & Rendimiento</CardTitle>
            <CardDescription className="text-xs">
              Tenant: <strong className="text-white">{empresaActual?.nombre}</strong> • Línea: <strong className="text-emerald-400">{numeroActual?.alias}</strong> ({numeroActual?.numero})
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-semibold">Rango Temporal:</span>
            <Badge variant="default" className="font-bold">
              Últimos 7 días
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-500/30">
          <CardContent className="p-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Mensajes Hoy</span>
            <div className="mt-2 text-3xl font-black text-emerald-400">
              {formatNumber(analytics.totalMensajesHoy)}
            </div>
            <span className="text-[11px] text-emerald-300 font-medium mt-1 block">Tasa de entrega verificada: 98.4%</span>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30">
          <CardContent className="p-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tiempo Medio SLA</span>
            <div className="mt-2 text-3xl font-black text-blue-400">
              {analytics.tiempoRespuestaPromedioSegundos} seg
            </div>
            <span className="text-[11px] text-blue-300 font-medium mt-1 block">Dentro del estándar de calidad</span>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardContent className="p-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resolución Automática Bot</span>
            <div className="mt-2 text-3xl font-black text-purple-400">
              {analytics.tasaResolucionBot}%
            </div>
            <span className="text-[11px] text-purple-300 font-medium mt-1 block">Derivados a agentes: {analytics.tasaResolucionHumano}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Volumen Semanal de Mensajes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics.mensajesPorDia} height={220} barColor="#10b981" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Distribución Horaria del Tráfico</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={analytics.volumenPorHora} height={220} lineColor="#3b82f6" fillColor="#1e3a8a" />
          </CardContent>
        </Card>
      </div>

      {/* Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Resolución por Canal: Bot vs Asesor Humano</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              segments={[
                { label: 'Bot Inteligente', porcentaje: analytics.tasaResolucionBot, color: '#a855f7' },
                { label: 'Asesor Humano', porcentaje: analytics.tasaResolucionHumano, color: '#10b981' },
              ]}
              size={160}
              centerText={`${analytics.tasaResolucionBot}%`}
              centerSubtext="Bot"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Distribución de Origen</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              segments={[
                { label: 'WhatsApp Cloud API', porcentaje: 85, color: '#10b981' },
                { label: 'Chat Web Sincronizado', porcentaje: 15, color: '#3b82f6' },
              ]}
              size={160}
              centerText="WABA"
              centerSubtext="Principal"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
