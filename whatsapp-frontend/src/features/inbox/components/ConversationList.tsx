import React from 'react';
import { Search, Bot, UserCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { ConversacionMock, ConversationFilter } from '../types/inbox.types';
import { formatTime } from '../../../shared/utils/formatters';

interface ConversationListProps {
  conversaciones: ConversacionMock[];
  selectedId: string | null;
  onSelect: (conv: ConversacionMock) => void;
  filtro: ConversationFilter;
  setFiltro: (filtro: ConversationFilter) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversaciones,
  selectedId,
  onSelect,
  filtro,
  setFiltro,
  busqueda,
  setBusqueda,
}) => {
  const filtered = conversaciones.filter((c) => {
    if (filtro !== 'all' && c.estado !== filtro) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const matchName = c.contactoNombre.toLowerCase().includes(q);
      const matchPhone = c.contactoTelefono.includes(q);
      const matchLastMsg = c.ultimoMensaje.toLowerCase().includes(q);
      return matchName || matchPhone || matchLastMsg;
    }
    return true;
  });

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Search and Filters Header */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/50">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por contacto o mensaje..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] text-slate-800 shadow-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex border border-slate-300 rounded-md p-0.5 bg-slate-200/70 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setFiltro('all')}
            className={`flex-1 py-1 text-center rounded transition-all ${
              filtro === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFiltro('bot')}
            className={`flex-1 py-1 text-center rounded transition-all flex items-center justify-center gap-1 ${
              filtro === 'bot'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Bot className="w-3 h-3" /> Bot
          </button>
          <button
            type="button"
            onClick={() => setFiltro('human')}
            className={`flex-1 py-1 text-center rounded transition-all flex items-center justify-center gap-1 ${
              filtro === 'human'
                ? 'bg-[#008069] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-[#008069]'
            }`}
          >
            <UserCheck className="w-3 h-3" /> Agente
          </button>
          <button
            type="button"
            onClick={() => setFiltro('closed')}
            className={`flex-1 py-1 text-center rounded transition-all flex items-center justify-center gap-1 ${
              filtro === 'closed'
                ? 'bg-slate-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" /> Cerradas
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <MessageSquare className="w-6 h-6 mx-auto text-slate-300 mb-2" />
            No hay conversaciones que coincidan
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border-l-4 border-l-[#008069]'
                    : 'hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-[#008069] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      {conv.contactoNombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {conv.contactoNombre}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 font-semibold truncate">
                        {conv.contactoTelefono}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500 font-semibold">
                      {formatTime(conv.ultimoMensajeTimestamp)}
                    </div>
                    {conv.noLeidos > 0 && (
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full mt-1 shadow-xs">
                        {conv.noLeidos}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs gap-2">
                  <p className="text-[11px] text-slate-600 truncate max-w-[200px] font-normal">
                    {conv.ultimoMensaje}
                  </p>

                  {/* Status Badge */}
                  {conv.estado === 'bot' && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded font-bold">
                      <Bot className="w-2.5 h-2.5" /> BOT
                    </span>
                  )}
                  {conv.estado === 'human' && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[9px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">
                      <UserCheck className="w-2.5 h-2.5" /> AGENTE
                    </span>
                  )}
                  {conv.estado === 'closed' && (
                    <span className="shrink-0 text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                      CERRADA
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
