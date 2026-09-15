import React from 'react';
import { Search, Bot, UserCheck, CheckCircle2, MessageSquare, Star } from 'lucide-react';
import { ConversacionMock, ConversationFilter } from '../types/inbox.types';
import { formatTime } from '../../../shared/utils/formatters';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar } from '../../../shared/components/ui/avatar';

interface ConversationListProps {
  conversaciones: ConversacionMock[];
  selectedId: string | null;
  onSelect: (conv: ConversacionMock) => void;
  filtro: ConversationFilter;
  setFiltro: (filtro: ConversationFilter) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
  onToggleFavorito?: (convId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversaciones,
  selectedId,
  onSelect,
  filtro,
  setFiltro,
  busqueda,
  setBusqueda,
  onToggleFavorito,
}) => {
  const filtered = conversaciones.filter((c) => {
    if (filtro === 'favorites' && !c.favorito) return false;
    if (filtro !== 'all' && filtro !== 'favorites' && c.estado !== filtro) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const matchName = c.contactoNombre.toLowerCase().includes(q);
      const matchPhone = c.contactoTelefono.includes(q);
      const matchLastMsg = c.ultimoMensaje.toLowerCase().includes(q);
      return matchName || matchPhone || matchLastMsg;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.favorito && !b.favorito) return -1;
    if (!a.favorito && b.favorito) return 1;
    return b.ultimoMensajeTimestamp.localeCompare(a.ultimoMensajeTimestamp);
  });

  return (
    <div className="w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full">
      {/* Search and Filters Header */}
      <div className="p-3.5 border-b border-slate-800 space-y-3 bg-slate-950/60">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input
            type="text"
            placeholder="Buscar por contacto o mensaje..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-950"
          />
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-5 gap-0.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setFiltro('all')}
            className={`py-1.5 text-center rounded-lg transition-all ${
              filtro === 'all'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFiltro('favorites')}
            className={`py-1.5 text-center rounded-lg transition-all flex items-center justify-center gap-0.5 ${
              filtro === 'favorites'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-amber-400'
            }`}
            title="Conversaciones favoritas / ancladas"
          >
            <Star className="w-3 h-3 fill-current" /> Favs
          </button>
          <button
            type="button"
            onClick={() => setFiltro('bot')}
            className={`py-1.5 text-center rounded-lg transition-all flex items-center justify-center gap-0.5 ${
              filtro === 'bot'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-purple-400'
            }`}
          >
            <Bot className="w-3 h-3" /> Bot
          </button>
          <button
            type="button"
            onClick={() => setFiltro('human')}
            className={`py-1.5 text-center rounded-lg transition-all flex items-center justify-center gap-0.5 ${
              filtro === 'human'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <UserCheck className="w-3 h-3" /> Agente
          </button>
          <button
            type="button"
            onClick={() => setFiltro('closed')}
            className={`py-1.5 text-center rounded-lg transition-all flex items-center justify-center gap-0.5 ${
              filtro === 'closed'
                ? 'bg-slate-700 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" /> Cerradas
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {sorted.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <MessageSquare className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            No hay conversaciones que coincidan
          </div>
        ) : (
          sorted.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500'
                    : 'hover:bg-slate-800/40 bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      fallback={conv.contactoNombre.substring(0, 2).toUpperCase()}
                      size="md"
                      className="bg-emerald-600/30 text-emerald-400 border-emerald-500/40 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                        <span className="truncate">{conv.contactoNombre}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 font-semibold truncate">
                        {conv.contactoTelefono}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorito?.(conv.id);
                      }}
                      title={conv.favorito ? 'Quitar de favoritos' : 'Anclar como favorito'}
                      className={`p-1 rounded-md hover:bg-slate-800 transition-colors ${
                        conv.favorito ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${conv.favorito ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {formatTime(conv.ultimoMensajeTimestamp)}
                      </div>
                      {conv.noLeidos > 0 && (
                        <Badge variant="success" className="px-1.5 py-0 text-[10px] rounded-full mt-1">
                          {conv.noLeidos}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs gap-2">
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {conv.ultimoMensaje}
                  </p>

                  {/* Status Badge */}
                  {conv.estado === 'bot' && (
                    <Badge variant="outline" className="gap-1 text-[9px] border-purple-500/30 text-purple-400 bg-purple-500/10">
                      <Bot className="w-2.5 h-2.5" /> BOT
                    </Badge>
                  )}
                  {conv.estado === 'human' && (
                    <Badge variant="success" className="gap-1 text-[9px]">
                      <UserCheck className="w-2.5 h-2.5" /> AGENTE
                    </Badge>
                  )}
                  {conv.estado === 'closed' && (
                    <Badge variant="secondary" className="text-[9px]">
                      CERRADA
                    </Badge>
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

export default ConversationList;
