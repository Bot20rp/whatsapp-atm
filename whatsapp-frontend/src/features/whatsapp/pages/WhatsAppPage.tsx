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
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card';
import { Dialog } from '../../../shared/components/ui/dialog';

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
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Líneas Corporativas WhatsApp Business</CardTitle>
            <CardDescription className="text-xs">
              Gestión de WABA (WhatsApp Business Account) de <strong className="text-emerald-400">{empresaActual?.nombre}</strong>
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl font-semibold text-slate-300">
            <span>Capacidad del Plan:</span>
            <span className="font-extrabold text-emerald-400">
              {numerosDisponibles.length} de {empresaActual?.totalNumerosPermitidos} líneas activas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Líneas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {numerosDisponibles.map((num) => {
          const isSelected = num.id === numeroActual?.id;
          const isBusy = actualizandoId === num.id;

          return (
            <Card
              key={num.id}
              className={`flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <CardContent className="p-6">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-md">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{num.alias}</h3>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">{num.numero}</span>
                    </div>
                  </div>

                  {num.esPrincipal && (
                    <Badge variant="default" className="text-[9px] uppercase font-bold">
                      Principal
                    </Badge>
                  )}
                </div>

                {/* Connection Status Badge */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Estado de Conexión</span>
                  {num.estado === 'conectado' && (
                    <Badge variant="success" className="gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En línea
                    </Badge>
                  )}
                  {num.estado === 'pendiente_verificacion' && (
                    <Badge variant="warning" className="gap-1 text-[11px]">
                      <Clock3 className="w-3.5 h-3.5" /> Verificación Meta
                    </Badge>
                  )}
                  {num.estado === 'desconectado' && (
                    <Badge variant="destructive" className="gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> Desconectada
                    </Badge>
                  )}
                </div>

                {/* Tech specifications */}
                <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Meta WABA ID:</span>
                    <span className="font-mono text-[11px] font-bold text-white">{num.metaWabaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Calidad de Línea:</span>
                    <span className="font-extrabold text-emerald-400 uppercase">{num.calidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Límite Diario:</span>
                    <span className="font-bold text-slate-200">{num.limiteDiario.toLocaleString()} envíos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Mensajes Hoy:</span>
                    <span className="font-extrabold text-emerald-400">{num.mensajesHoy}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => cambiarNumero(num.id)}
                    disabled={isSelected}
                    className="flex-1 font-bold text-xs"
                  >
                    {isSelected ? 'Línea Seleccionada' : 'Fijar como Activa'}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQrModalNumero(num)}
                    title="Escanear QR de sincronización WABA"
                    className="h-9 w-9"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                  </Button>

                  <Button
                    variant={num.estado === 'conectado' ? 'destructive' : 'default'}
                    size="icon"
                    disabled={isBusy}
                    onClick={() => handleToggleConexion(num)}
                    title={num.estado === 'conectado' ? 'Desconectar línea' : 'Conectar línea'}
                    className="h-9 w-9"
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Integration Technical Specifications Box */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Especificación del Punto de Integración WhatsApp Cloud API</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Las líneas están estructuradas bajo el estándar de Meta Cloud API v25.0. Cada evento de mensaje entrante (webhook) es validado contra el identificador de tenant (`empresaId`) y despachado al canal correspondiente (`numeroId`), garantizando aislamiento total entre empresas y números.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 font-semibold">
              <strong>Endpoint Webhook:</strong> /api/v1/waba/webhook
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 font-semibold">
              <strong>Eventos Soportados:</strong> messages, message_status
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 font-semibold">
              <strong>Cifrado E2E:</strong> Activo por Meta WABA
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Modal QR Pairing */}
      {qrModalNumero && (
        <Dialog
          isOpen={!!qrModalNumero}
          onClose={() => setQrModalNumero(null)}
          title={`Vincular Dispositivo - ${qrModalNumero.alias}`}
          description="Escanee el código QR desde la aplicación WhatsApp en su teléfono móvil"
          className="max-w-sm text-center"
        >
          <div className="my-4 p-5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-white border-2 border-slate-700 p-2.5 rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
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
            <span className="text-[10px] font-mono text-slate-400 font-bold mt-3">
              ID de sesión: {qrModalNumero.metaWabaId}
            </span>
          </div>

          <Button
            onClick={() => setQrModalNumero(null)}
            className="w-full font-bold"
            size="sm"
          >
            Cerrar Ventana
          </Button>
        </Dialog>
      )}
    </div>
  );
};

export default WhatsAppPage;
