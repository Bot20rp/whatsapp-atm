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
  ArrowUpRight,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';

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
      <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="uppercase font-bold tracking-wider text-[10px]">
                Organización Activa
              </Badge>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">{empresaActual?.identificadorFiscal}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5">{empresaActual?.nombre}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Línea activa de mensajería: <strong className="text-emerald-400">{numeroActual?.alias}</strong> ({numeroActual?.numero})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/inbox">
              <Button size="sm" className="gap-2 font-bold shadow-lg shadow-emerald-500/20">
                Ir a Bandeja
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/whatsapp">
              <Button variant="outline" size="sm">
                Gestionar Líneas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards with shadcn Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mensajes Hoy */}
        <Card className="border-emerald-500/30 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mensajes Hoy</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {formatNumber(analytics.totalMensajesHoy)}
              </span>
              <Badge variant="success" className="text-[10px]">+12% hoy</Badge>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Línea: {numeroActual?.alias}</div>
          </CardContent>
        </Card>

        {/* Card 2: Conversaciones Abiertas */}
        <Card className="border-blue-500/30 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chats Activos</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {formatNumber(analytics.conversacionesAbiertas)}
              </span>
              <Badge variant="secondary" className="text-[10px]">En curso</Badge>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Atendidas por agentes y bot</div>
          </CardContent>
        </Card>

        {/* Card 3: Tiempo Respuesta */}
        <Card className="border-amber-500/30 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo SLA</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {analytics.tiempoRespuestaPromedioSegundos}s
              </span>
              <Badge variant="success" className="text-[10px]">Óptimo</Badge>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Meta corporativa: &lt; 90s</div>
          </CardContent>
        </Card>

        {/* Card 4: Resolución por Bot */}
        <Card className="border-purple-500/30 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolución Bot</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {analytics.tasaResolucionBot}%
              </span>
              <Badge variant="outline" className="text-[10px]">Automático</Badge>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Escalado a humanos: {analytics.tasaResolucionHumano}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & WhatsApp Lines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Volumen Diario de Mensajes</CardTitle>
                <CardDescription className="text-xs">Tráfico procesado en los últimos 7 días</CardDescription>
              </div>
              <Badge variant="default" className="text-[10px]">
                {numeroActual?.alias}
              </Badge>
            </CardHeader>
            <CardContent>
              <BarChart data={analytics.mensajesPorDia} height={200} barColor="#10b981" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Curva de Actividad por Horario</CardTitle>
              <CardDescription className="text-xs">Picos de mensajes entrantes y salientes</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={analytics.volumenPorHora}
                height={180}
                lineColor="#3b82f6"
                fillColor="#1e3a8a"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Lines Status & Bot Distribution */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Líneas WhatsApp ({numeros.length})</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {empresaActual?.logoIniciales}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              {numeros.map((num) => (
                <div
                  key={num.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    num.id === numeroActual?.id
                      ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className={`w-4 h-4 ${num.id === numeroActual?.id ? 'text-emerald-400' : 'text-slate-500'} shrink-0`} />
                      <span className="font-bold text-white">{num.alias}</span>
                    </div>
                    {num.estado === 'conectado' && (
                      <Badge variant="success" className="gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Conectado
                      </Badge>
                    )}
                    {num.estado === 'pendiente_verificacion' && (
                      <Badge variant="warning" className="gap-1 text-[10px]">
                        <Clock3 className="w-3 h-3" /> Verificación
                      </Badge>
                    )}
                    {num.estado === 'desconectado' && (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <AlertCircle className="w-3 h-3" /> Desconectado
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>{num.numero}</span>
                    <span className="font-semibold text-slate-300">Calidad: {num.calidad.toUpperCase()}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Hoy: <strong className="text-white">{num.mensajesHoy}</strong> msgs</span>
                    <span>Límite: {num.limiteDiario.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-300">Resolución Bot vs Humano</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                segments={[
                  { label: 'Bot Inteligente', porcentaje: analytics.tasaResolucionBot, color: '#a855f7' },
                  { label: 'Agentes Humanos', porcentaje: analytics.tasaResolucionHumano, color: '#10b981' },
                ]}
                size={140}
                centerText={`${analytics.tasaResolucionBot}%`}
                centerSubtext="Automático"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
