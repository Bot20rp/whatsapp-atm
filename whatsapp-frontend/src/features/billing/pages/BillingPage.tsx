import React from 'react';
import { CreditCard, Check, Smartphone, MessageSquare } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { formatNumber } from '../../../shared/utils/formatters';

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
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#008069] uppercase tracking-wider">
              Facturación & Consumos
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              {empresaActual.identificadorFiscal}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            Plan Contratado: <span className="text-[#008069]">{empresaActual.plan.toUpperCase()}</span>
          </h2>
          <p className="text-xs text-slate-600">Organización: {empresaActual.nombre}</p>
        </div>

        <button
          type="button"
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 flex items-center gap-1.5 shadow-sm"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Gestionar Suscripción</span>
        </button>
      </div>

      {/* Resource Quotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mensajes WABA Mes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#008069] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase">
                Consumo Mensual de Mensajes
              </span>
            </div>
            <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {pctMensajes}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 my-4 overflow-hidden border border-slate-200">
            <div
              className="bg-[#008069] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(pctMensajes, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-600">
            <span>
              Usados: <strong className="text-slate-900">{formatNumber(empresaActual.mensajesUsadosMes)}</strong>
            </span>
            <span>
              Límite mensual: <strong className="text-slate-900">{formatNumber(empresaActual.limiteMensajesMensual)}</strong>
            </span>
          </div>
        </div>

        {/* Líneas WhatsApp Permitidas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#008069] flex items-center justify-center">
                <Smartphone className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase">Líneas WhatsApp Autorizadas</span>
            </div>
            <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {pctNumeros}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 my-4 overflow-hidden border border-slate-200">
            <div
              className="bg-[#008069] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(pctNumeros, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-600">
            <span>
              Activas: <strong className="text-slate-900">{numerosDisponibles.length}</strong>
            </span>
            <span>
              Cupo máximo: <strong className="text-slate-900">{empresaActual.totalNumerosPermitidos} líneas</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Plan Features Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-3">
          Beneficios Incluidos en el Plan {empresaActual.plan.toUpperCase()}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Acceso oficial a WhatsApp Cloud API v20.0</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Automatizaciones y Bot con IA sin límite</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Multi-agente con roles y permisos por número</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Métricas analíticas y exportación de reportes</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Webhooks en tiempo real con SLA 99.9%</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
            <Check className="w-4 h-4 text-[#008069] stroke-[3] shrink-0" />
            <span>Soporte técnico corporativo prioritario</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
