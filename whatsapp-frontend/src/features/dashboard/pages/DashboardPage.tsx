import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Users,
  Clock,
  Bot,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { dashboardApi } from '../api/dashboard.api';
import { AnalyticsMock } from '../../../mocks/data/analytics.mock';
import { NumeroMock } from '../../../mocks/data/numeros.mock';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { LineChart } from '../../../shared/components/charts/LineChart';
import { DonutChart } from '../../../shared/components/charts/DonutChart';
import { formatNumber } from '../../../shared/utils/formatters';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { empresaActual, numeroActual } = useTenant();
  const [data, setData] = useState<{ analytics: AnalyticsMock; numeros: NumeroMock[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!empresaActual || !numeroActual) return;
    try {
      setLoading(true);
      const res = await dashboardApi.getDashboardSummary(empresaActual.id, numeroActual.id);
      setData(res);
    } catch {
      // Manejar error silenciosamente
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id, numeroActual?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !data) {
    return <Spinner text="Cargando métricas del tenant..." size="lg" />;
  }

  const { analytics, numeros } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Context Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008069]">
              Organización Activa
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">{empresaActual?.identificadorFiscal}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">{empresaActual?.nombre}</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Línea activa de mensajería: <strong className="text-[#008069]">{numeroActual?.alias}</strong> ({numeroActual?.numero})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/inbox"
            className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 shadow-sm"
          >
            Ir a Bandeja de Entrada
          </Link>
          <Link
            to="/whatsapp"
            className="btn btn-sm bg-white hover:bg-slate-50 text-slate-800 text-xs border border-slate-300 font-semibold px-4 shadow-xs"
          >
            Gestionar Líneas
          </Link>
        </div>
      </div>

      {/* KPI Cards with High Contrast and Vibrant Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mensajes Hoy (Emerald) */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mensajes Hoy</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatNumber(analytics.totalMensajesHoy)}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">+12% hoy</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Línea: {numeroActual?.alias}</div>
        </div>

        {/* Card 2: Conversaciones Abiertas (Blue) */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Chats Activos</span>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatNumber(analytics.conversacionesAbiertas)}
            </span>
            <span className="text-[11px] text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded font-bold">En curso</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Atendidas por agentes y bot</div>
        </div>

        {/* Card 3: Tiempo Respuesta (Amber) */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tiempo SLA</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {analytics.tiempoRespuestaPromedioSegundos}s
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Óptimo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Meta corporativa: &lt; 90s</div>
        </div>

        {/* Card 4: Resolución por Bot (Purple) */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-600 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Resolución Bot</span>
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {analytics.tasaResolucionBot}%
            </span>
            <span className="text-[11px] text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded font-bold">Automático</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Escalado a humanos: {analytics.tasaResolucionHumano}%</div>
        </div>
      </div>

      {/* Main Charts & WhatsApp Lines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Volumen de Mensajes Últimos 7 Días */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Volumen Diario de Mensajes
                </h3>
                <p className="text-[11px] text-slate-500">Tráfico procesado en los últimos 7 días</p>
              </div>
              <span className="badge badge-sm bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[10px]">
                {numeroActual?.alias}
              </span>
            </div>
            <BarChart data={analytics.mensajesPorDia} height={200} barColor="#008069" />
          </div>

          {/* Distribución Horaria de Tráfico */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Curva de Actividad por Horario
                </h3>
                <p className="text-[11px] text-slate-500">Picos de mensajes entrantes y salientes</p>
              </div>
            </div>
            <LineChart
              data={analytics.volumenPorHora}
              height={180}
              lineColor="#2563EB"
              fillColor="#DBEAFE"
            />
          </div>
        </div>

        {/* Right 1 Col: Lines Status & Bot Distribution */}
        <div className="space-y-6">
          {/* Estado de Líneas WhatsApp del Tenant */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Líneas WhatsApp ({numeros.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {empresaActual?.logoIniciales}
              </span>
            </div>

            <div className="space-y-3">
              {numeros.map((num) => (
                <div
                  key={num.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    num.id === numeroActual?.id
                      ? 'bg-emerald-50/60 border-[#008069] ring-1 ring-[#008069]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className={`w-4 h-4 ${num.id === numeroActual?.id ? 'text-[#008069]' : 'text-slate-500'} shrink-0`} />
                      <span className="font-bold text-slate-900">{num.alias}</span>
                    </div>
                    {num.estado === 'conectado' && (
                      <span className="flex items-center gap-1 text-[10px] text-white bg-emerald-600 px-2 py-0.5 rounded font-bold shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Conectado
                      </span>
                    )}
                    {num.estado === 'pendiente_verificacion' && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-900 bg-amber-200 px-2 py-0.5 rounded font-bold">
                        <Clock3 className="w-3 h-3" /> Verificación
                      </span>
                    )}
                    {num.estado === 'desconectado' && (
                      <span className="flex items-center gap-1 text-[10px] text-rose-800 bg-rose-100 px-2 py-0.5 rounded font-bold">
                        <AlertCircle className="w-3 h-3" /> Desconectado
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-600 flex justify-between">
                    <span>{num.numero}</span>
                    <span className="font-semibold text-slate-800">Calidad: {num.calidad.toUpperCase()}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Hoy: <strong className="text-slate-800">{num.mensajesHoy}</strong> msgs</span>
                    <span>Límite: {num.limiteDiario.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución Bot vs Agente Humano */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
              Resolución Bot vs Humano
            </h3>
            <DonutChart
              segments={[
                { label: 'Bot Inteligente', porcentaje: analytics.tasaResolucionBot, color: '#7C3AED' },
                { label: 'Agentes Humanos', porcentaje: analytics.tasaResolucionHumano, color: '#008069' },
              ]}
              size={140}
              centerText={`${analytics.tasaResolucionBot}%`}
              centerSubtext="Automático"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
