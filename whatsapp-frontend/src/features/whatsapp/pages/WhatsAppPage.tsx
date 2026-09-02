import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock3,
  QrCode,
  Power,
  ShieldCheck,
} from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { NumeroMock } from '../types/whatsapp.types';

export const WhatsAppPage: React.FC = () => {
  const {
    empresaActual,
    numerosDisponibles,
    numeroActual,
    cambiarNumero,
    actualizarEstadoNumeroLocal,
  } = useTenant();

  const [qrModalNumero, setQrModalNumero] = useState<NumeroMock | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  const handleToggleConexion = async (num: NumeroMock) => {
    try {
      setActualizandoId(num.id);
      const nuevoEstado = num.estado === 'conectado' ? 'desconectado' : 'conectado';
      await actualizarEstadoNumeroLocal(num.id, nuevoEstado);
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">Líneas Corporativas WhatsApp Business</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Gestión de WABA (WhatsApp Business Account) de <strong className="text-[#008069]">{empresaActual?.nombre}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-lg font-semibold">
          <span className="text-slate-600">Capacidad del Plan:</span>
          <span className="font-extrabold text-[#008069]">
            {numerosDisponibles.length} de {empresaActual?.totalNumerosPermitidos} líneas activas
          </span>
        </div>
      </div>

      {/* Grid de Líneas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {numerosDisponibles.map((num) => {
          const isSelected = num.id === numeroActual?.id;
          const isBusy = actualizandoId === num.id;

          return (
            <div
              key={num.id}
              className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs ${
                isSelected
                  ? 'border-[#008069] ring-2 ring-[#008069] shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#008069] flex items-center justify-center shadow-xs">
                      <Smartphone className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{num.alias}</h3>
                      <span className="text-[11px] font-mono text-slate-500 font-bold">{num.numero}</span>
                    </div>
                  </div>

                  {num.esPrincipal && (
                    <span className="text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded font-black uppercase shadow-xs">
                      Principal
                    </span>
                  )}
                </div>

                {/* Connection Status Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">Estado de Conexión</span>
                  {num.estado === 'conectado' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En línea
                    </span>
                  )}
                  {num.estado === 'pendiente_verificacion' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-amber-500 px-2.5 py-0.5 rounded shadow-xs">
                      <Clock3 className="w-3.5 h-3.5" /> Verificación Meta
                    </span>
                  )}
                  {num.estado === 'desconectado' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600 px-2.5 py-0.5 rounded shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Desconectada
                    </span>
                  )}
                </div>

                {/* Tech specifications */}
                <div className="mt-3.5 space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Meta WABA ID:</span>
                    <span className="font-mono text-[11px] font-bold text-slate-900">{num.metaWabaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Calidad de Línea:</span>
                    <span className="font-extrabold text-[#008069] uppercase">{num.calidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Límite Diario:</span>
                    <span className="font-bold text-slate-800">{num.limiteDiario.toLocaleString()} envíos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mensajes Hoy:</span>
                    <span className="font-black text-emerald-700">{num.mensajesHoy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => cambiarNumero(num.id)}
                  disabled={isSelected}
                  className={`btn btn-xs text-xs font-bold flex-1 ${
                    isSelected
                      ? 'bg-slate-200 text-slate-500 border-none'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs'
                  }`}
                >
                  {isSelected ? 'Línea Seleccionada' : 'Fijar como Activa'}
                </button>

                <button
                  type="button"
                  onClick={() => setQrModalNumero(num)}
                  className="btn btn-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-2.5 shadow-xs"
                  title="Escanear QR de sincronización WABA"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleToggleConexion(num)}
                  className={`btn btn-xs border-none px-3 font-bold text-white shadow-xs ${
                    num.estado === 'conectado'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  title={num.estado === 'conectado' ? 'Desconectar línea' : 'Conectar línea'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Technical Specifications Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
          <ShieldCheck className="w-5 h-5 text-[#008069]" />
          <span>Especificación del Punto de Integración WhatsApp Cloud API</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Las líneas están estructuradas bajo el estándar de Meta Cloud API v20.0. Cada evento de mensaje entrante (webhook) es validado contra el identificador de tenant (`empresaId`) y despachado al canal correspondiente (`numeroId`), garantizando aislamiento total entre empresas y números.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-slate-700 font-semibold">
            <strong>Endpoint Webhook:</strong> /api/v1/waba/webhook
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-slate-700 font-semibold">
            <strong>Eventos Soportados:</strong> messages, message_status
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-slate-700 font-semibold">
            <strong>Cifrado E2E:</strong> Activo por Meta WABA
          </div>
        </div>
      </div>

      {/* Modal QR Pairing */}
      {qrModalNumero && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-base font-black text-slate-900">
              Vincular Dispositivo - {qrModalNumero.alias}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Escanee el código QR desde la aplicación WhatsApp en su teléfono móvil.
            </p>

            <div className="my-5 p-5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-white border-2 border-slate-300 p-2.5 rounded-md flex items-center justify-center shadow-xs">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                  <rect x="10" y="10" width="15" height="15" fill="#fff" />
                  <rect x="75" y="10" width="15" height="15" fill="#fff" />
                  <rect x="10" y="75" width="15" height="15" fill="#fff" />
                  <rect x="14" y="14" width="7" height="7" fill="currentColor" />
                  <rect x="79" y="14" width="7" height="7" fill="currentColor" />
                  <rect x="14" y="79" width="7" height="7" fill="currentColor" />
                  <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                  <rect x="48" y="15" width="8" height="8" fill="currentColor" />
                  <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                  <rect x="42" y="42" width="16" height="16" fill="#fff" />
                  <rect x="46" y="46" width="8" height="8" fill="currentColor" />
                  <rect x="70" y="40" width="10" height="8" fill="currentColor" />
                  <rect x="85" y="55" width="10" height="10" fill="currentColor" />
                  <rect x="40" y="75" width="15" height="10" fill="currentColor" />
                  <rect x="65" y="75" width="25" height="20" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-slate-600 font-bold mt-2.5">
                ID de sesión: {qrModalNumero.metaWabaId}
              </span>
            </div>

            <button
              onClick={() => setQrModalNumero(null)}
              className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white border-none text-xs font-bold w-full shadow-sm"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppPage;
