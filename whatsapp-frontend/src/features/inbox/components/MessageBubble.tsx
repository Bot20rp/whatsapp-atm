import React from 'react';
import { Bot, User, Check, CheckCheck } from 'lucide-react';
import { MensajeMock } from '../types/inbox.types';
import { formatTime } from '../../../shared/utils/formatters';

interface MessageBubbleProps {
  mensaje: MensajeMock;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ mensaje }) => {
  const isCustomer = mensaje.remitente === 'customer';
  const isBot = mensaje.remitente === 'bot';
  const isAgent = mensaje.remitente === 'agent';

  // Customer messages on the left, Agent and Bot on the right
  return (
    <div className={`flex flex-col my-2.5 ${isCustomer ? 'items-start' : 'items-end'}`}>
      {/* Sender Header Badge */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        {isCustomer && (
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {mensaje.nombreEmisor}
          </span>
        )}
        {isBot && (
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-white bg-indigo-600 px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            <Bot className="w-3 h-3" />
            BOT INTELIGENTE
          </span>
        )}
        {isAgent && (
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-white bg-[#008069] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            <User className="w-3 h-3" />
            AGENTE: {mensaje.nombreEmisor}
          </span>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[78%] sm:max-w-[68%] rounded-xl p-3.5 text-xs leading-relaxed border shadow-xs ${
          isCustomer
            ? 'bg-white border-slate-200 text-slate-900 rounded-tl-none'
            : isBot
            ? 'bg-indigo-50 border-indigo-200 text-slate-900 rounded-tr-none'
            : 'bg-[#008069] border-[#006654] text-white rounded-tr-none'
        }`}
      >
        <p className="whitespace-pre-wrap select-text font-normal">{mensaje.contenido}</p>

        {/* Footer info: time & delivery checks */}
        <div
          className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
            isAgent ? 'text-emerald-100 font-medium' : isBot ? 'text-indigo-600 font-medium' : 'text-slate-500 font-medium'
          }`}
        >
          <span>{formatTime(mensaje.timestamp)}</span>
          {!isCustomer && (
            <span className="inline-flex items-center">
              {mensaje.estado === 'leido' ? (
                <CheckCheck className="w-3.5 h-3.5 text-cyan-300 stroke-[2.5]" />
              ) : mensaje.estado === 'entregado' ? (
                <CheckCheck className="w-3.5 h-3.5 opacity-80" />
              ) : (
                <Check className="w-3 h-3 opacity-80" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
