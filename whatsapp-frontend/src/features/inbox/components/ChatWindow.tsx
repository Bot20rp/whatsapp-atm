import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  Info,
  Star,
} from 'lucide-react';
import { ConversacionMock, MensajeMock } from '../types/inbox.types';
import { MessageBubble } from './MessageBubble';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar } from '../../../shared/components/ui/avatar';

interface ChatWindowProps {
  conversacion: ConversacionMock;
  mensajes: MensajeMock[];
  onEnviarMensaje: (contenido: string, remitente?: 'agent' | 'bot') => Promise<void>;
  onCambiarEstado: (estado: 'bot' | 'human' | 'closed') => Promise<void>;
  onToggleSidebar: () => void;
  sidebarAbierto: boolean;
  onToggleFavorito?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversacion,
  mensajes,
  onEnviarMensaje,
  onCambiarEstado,
  onToggleSidebar,
  sidebarAbierto,
  onToggleFavorito,
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
    <div className="flex-1 flex flex-col h-full bg-slate-950 min-w-0">
      {/* Chat Header */}
      <div className="h-16 px-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar
            fallback={conversacion.contactoNombre.substring(0, 2).toUpperCase()}
            size="md"
            className="bg-emerald-600/30 text-emerald-400 border-emerald-500/40"
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white truncate">
                {conversacion.contactoNombre}
              </h3>
              {/* Status Badge */}
              {conversacion.estado === 'bot' && (
                <Badge variant="outline" className="gap-1 text-[10px] border-purple-500/30 text-purple-400 bg-purple-500/10">
                  <Bot className="w-3 h-3" /> Bot Activo
                </Badge>
              )}
              {conversacion.estado === 'human' && (
                <Badge variant="success" className="gap-1 text-[10px]">
                  <UserCheck className="w-3 h-3" /> Agente: {conversacion.agenteAsignadoNombre || 'Asignado'}
                </Badge>
              )}
              {conversacion.estado === 'closed' && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Caso Cerrado
                </Badge>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              {conversacion.contactoTelefono}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {conversacion.estado === 'bot' && (
            <Button
              size="sm"
              onClick={() => onCambiarEstado('human')}
              className="gap-1 font-bold text-xs shadow-md shadow-emerald-500/20"
              title="Derivar conversación a un asesor humano"
            >
              <UserCheck className="w-3.5 h-3.5" /> Escalar a Humano
            </Button>
          )}

          {conversacion.estado === 'human' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCambiarEstado('bot')}
                className="gap-1 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                title="Devolver control al bot de respuestas automáticas"
              >
                <Bot className="w-3.5 h-3.5" /> Devolver al Bot
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCambiarEstado('closed')}
                className="gap-1 text-xs"
                title="Marcar como resuelta"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cerrar Caso
              </Button>
            </>
          )}

          {conversacion.estado === 'closed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCambiarEstado('human')}
              className="gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reabrir Caso
            </Button>
          )}

          <Button
            variant={conversacion.favorito ? 'default' : 'outline'}
            size="icon"
            onClick={onToggleFavorito}
            title={conversacion.favorito ? 'Quitar de favoritos' : 'Anclar como favorito'}
            className={`h-9 w-9 ${conversacion.favorito ? 'bg-amber-600 hover:bg-amber-500 text-white' : ''}`}
          >
            <Star className={`w-4 h-4 ${conversacion.favorito ? 'fill-current' : ''}`} />
          </Button>

          <Button
            variant={sidebarAbierto ? 'default' : 'outline'}
            size="icon"
            onClick={onToggleSidebar}
            title="Ver información del cliente"
            className="h-9 w-9"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {conversacion.estado === 'closed' && (
          <div className="my-3 p-2.5 text-center text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl font-medium">
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
        className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shadow-2xl"
      >
        <Input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder={
            conversacion.estado === 'closed'
              ? 'Escribe para reabrir y responder al cliente...'
              : 'Escribe una respuesta corporativa por WhatsApp...'
          }
          className="flex-1 bg-slate-950 text-xs"
        />

        <Button
          type="submit"
          disabled={!nuevoMensaje.trim() || enviando}
          size="sm"
          className="gap-1.5 font-bold"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
