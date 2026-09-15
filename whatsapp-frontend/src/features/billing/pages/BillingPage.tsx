import React from 'react';
import { CreditCard, Check, Smartphone, MessageSquare } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { formatNumber } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';

export const BillingPage: React.FC = () => {
  const { empresaActual, numerosDisponibles } = useTenant();

  if (!empresaActual) return null;

  const pctMensajes = Math.round(
    (empresaActual.mensajesUsadosMes / empresaActual.limiteMensajesMensual) * 100
  );
  const pctNumeros = Math.round(
    (numerosDisponibles.length / empresaActual.totalNumerosPermitidos) * 100
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="uppercase font-bold tracking-wider text-[10px]">
                Facturación & Consumos
              </Badge>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {empresaActual.identificadorFiscal}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5">
              Plan Contratado: <span className="text-emerald-400">{empresaActual.plan.toUpperCase()}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Organización: {empresaActual.nombre}</p>
          </div>

          <Button className="gap-2 font-bold shadow-lg shadow-emerald-500/20">
            <CreditCard className="w-4 h-4" />
            <span>Gestionar Suscripción</span>
          </Button>
        </CardContent>
      </Card>

      {/* Resource Quotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mensajes WABA Mes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Consumo Mensual de Mensajes
                </span>
              </div>
              <Badge variant="success" className="font-mono text-xs">
                {pctMensajes}%
              </Badge>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 my-4 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500 shadow-md shadow-emerald-500/30"
                style={{ width: `${Math.min(pctMensajes, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>
                Usados: <strong className="text-white">{formatNumber(empresaActual.mensajesUsadosMes)}</strong>
              </span>
              <span>
                Límite mensual: <strong className="text-white">{formatNumber(empresaActual.limiteMensajesMensual)}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Líneas WhatsApp Permitidas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Líneas WhatsApp Autorizadas</span>
              </div>
              <Badge variant="success" className="font-mono text-xs">
                {pctNumeros}%
              </Badge>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 my-4 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500 shadow-md shadow-emerald-500/30"
                style={{ width: `${Math.min(pctNumeros, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>
                Activas: <strong className="text-white">{numerosDisponibles.length}</strong>
              </span>
              <span>
                Cupo máximo: <strong className="text-white">{empresaActual.totalNumerosPermitidos} líneas</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Features Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-slate-300">
            Beneficios Incluidos en el Plan {empresaActual.plan.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acceso oficial a WhatsApp Cloud API v25.0</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automatizaciones y Bot con IA sin límite</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-agente con roles y permisos por número</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Métricas analíticas y exportación de reportes</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Webhooks en tiempo real con SLA 99.9%</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Soporte técnico corporativo prioritario</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
