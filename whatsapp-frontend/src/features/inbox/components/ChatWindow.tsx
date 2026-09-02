import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  Info,
} from 'lucide-react';
import { ConversacionMock, MensajeMock } from '../types/inbox.types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  conversacion: ConversacionMock;
  mensajes: MensajeMock[];
  onEnviarMensaje: (contenido: string, remitente?: 'agent' | 'bot') => Promise<void>;
  onCambiarEstado: (estado: 'bot' | 'human' | 'closed') => Promise<void>;
  onToggleSidebar: () => void;
  sidebarAbierto: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversacion,
  mensajes,
  onEnviarMensaje,
  onCambiarEstado,
  onToggleSidebar,
  sidebarAbierto,
}) => {
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || enviando) return;

    try {
      setEnviando(true);
      const text = nuevoMensaje;
      setNuevoMensaje('');
      await onEnviarMensaje(text, 'agent');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] min-w-0">
      {/* Chat Header */}
      <div className="h-16 px-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-[#008069] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {conversacion.contactoNombre.substring(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {conversacion.contactoNombre}
              </h3>
              {/* Status Badge */}
              {conversacion.estado === 'bot' && (
                <span className="flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-extrabold uppercase">
                  <Bot className="w-3 h-3" /> Bot Activo
                </span>
              )}
              {conversacion.estado === 'human' && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-extrabold uppercase">
                  <UserCheck className="w-3 h-3" /> Agente: {conversacion.agenteAsignadoNombre || 'Asignado'}
                </span>
              )}
              {conversacion.estado === 'closed' && (
                <span className="flex items-center gap-1 text-[10px] bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Caso Cerrado
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {conversacion.contactoTelefono}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {conversacion.estado === 'bot' && (
            <button
              onClick={() => onCambiarEstado('human')}
              className="btn btn-xs bg-[#008069] hover:bg-[#006654] text-white border-none font-bold px-3 flex items-center gap-1 shadow-xs"
              title="Derivar conversación a un asesor humano"
            >
              <UserCheck className="w-3.5 h-3.5" /> Escalar a Humano
            </button>
          )}

          {conversacion.estado === 'human' && (
            <>
              <button
                onClick={() => onCambiarEstado('bot')}
                className="btn btn-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-3 flex items-center gap-1 shadow-xs"
                title="Devolver control al bot de respuestas automáticas"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" /> Devolver al Bot
              </button>
              <button
                onClick={() => onCambiarEstado('closed')}
                className="btn btn-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold px-3 flex items-center gap-1 shadow-xs"
                title="Marcar como resuelta"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cerrar Caso
              </button>
            </>
          )}

          {conversacion.estado === 'closed' && (
            <button
              onClick={() => onCambiarEstado('human')}
              className="btn btn-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3 flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reabrir Caso
            </button>
          )}

          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-md border transition-colors ${
              sidebarAbierto
                ? 'bg-emerald-100 border-emerald-300 text-[#008069]'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
            title="Ver información del cliente"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {conversacion.estado === 'closed' && (
          <div className="my-3 p-2.5 text-center text-xs text-slate-700 bg-amber-50 border border-amber-200 rounded-md font-medium">
            Esta conversación fue marcada como <strong>Cerrada</strong>. Cualquier nuevo mensaje la reabrirá automáticamente.
          </div>
        )}

        {mensajes.map((m) => (
          <MessageBubble key={m.id} mensaje={m} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shadow-sm"
      >
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder={
            conversacion.estado === 'closed'
              ? 'Escribe para reabrir y responder al cliente...'
              : 'Escribe una respuesta corporativa por WhatsApp...'
          }
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] text-slate-900"
        />

        <button
          type="submit"
          disabled={!nuevoMensaje.trim() || enviando}
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white border-none font-bold px-5 flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};
