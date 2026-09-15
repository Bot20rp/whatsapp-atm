import { mockApi } from '../../../mocks/mock-api';
import { ConversacionMock, MensajeMock, ContactoMock } from '../types/inbox.types';
import { apiClient } from '../../../infrastructure/http/api-client';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

type BackendConversation = {
  id: string;
  contactoNombre: string;
  contactoTelefono: string;
  ultimoMensaje?: string;
  ultimoMensajeTimestamp?: string;
  noLeidos?: number;
  estado?: 'bot' | 'human' | 'closed';
};

type BackendMessage = {
  id: string;
  conversacionId: string;
  contactoTelefono: string;
  contenido: string;
  remitente: 'agent' | 'bot' | 'customer';
  nombreEmisor: string;
  timestamp: string;
  estado: 'enviado' | 'entregado';
  tipo: 'texto';
};

function mapConversation(value: BackendConversation, empresaId: string, numeroId: string): ConversacionMock {
  return {
    id: value.id,
    empresaId,
    numeroId,
    contactoId: `contact_${value.contactoTelefono}`,
    contactoNombre: value.contactoNombre,
    contactoTelefono: value.contactoTelefono,
    ultimoMensaje: value.ultimoMensaje || '',
    ultimoMensajeTimestamp: value.ultimoMensajeTimestamp || new Date(0).toISOString(),
    noLeidos: value.noLeidos || 0,
    estado: value.estado || 'human',
    agenteAsignadoId: 'usr_carlos_morales',
    agenteAsignadoNombre: 'Carlos Morales',
    etiquetas: [],
  };
}

function mapMessage(value: BackendMessage, empresaId: string, numeroId: string): MensajeMock {
  return { ...value, empresaId, numeroId };
}

interface ChatCache {
  conversations: ConversacionMock[];
  messages: Record<string, MensajeMock[]>;
}

function cacheKey(empresaId: string, numeroId: string): string {
  return `crm_chat_cache_${empresaId}_${numeroId}`;
}

function readCache(empresaId: string, numeroId: string): ChatCache {
  try {
    const raw = localStorage.getItem(cacheKey(empresaId, numeroId));
    if (raw) return JSON.parse(raw) as ChatCache;
  } catch {
    // Continuar sin caché si el almacenamiento del navegador no está disponible.
  }
  return { conversations: [], messages: {} };
}

function writeCache(empresaId: string, numeroId: string, value: ChatCache): void {
  try {
    localStorage.setItem(cacheKey(empresaId, numeroId), JSON.stringify(value));
  } catch {
    // La interfaz sigue funcionando aunque el almacenamiento esté lleno o bloqueado.
  }
}

function mergeMessages(messages: MensajeMock[], cached: MensajeMock[]): MensajeMock[] {
  const unique = new Map<string, MensajeMock>();
  [...messages, ...cached].forEach((message) => unique.set(message.id, message));
  return [...unique.values()].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function mergeConversations(conversations: ConversacionMock[], cached: ConversacionMock[]): ConversacionMock[] {
  const unique = new Map<string, ConversacionMock>();
  [...conversations, ...cached].forEach((conversation) => {
    const previous = unique.get(conversation.id);
    if (!previous) {
      unique.set(conversation.id, conversation);
    } else {
      const latest = conversation.ultimoMensajeTimestamp >= previous.ultimoMensajeTimestamp ? conversation : previous;
      const favorito = conversation.favorito !== undefined ? conversation.favorito : previous.favorito;
      unique.set(conversation.id, { ...latest, favorito });
    }
  });
  return [...unique.values()].sort((a, b) => b.ultimoMensajeTimestamp.localeCompare(a.ultimoMensajeTimestamp));
}

function saveConversations(empresaId: string, numeroId: string, conversations: ConversacionMock[]): void {
  const cache = readCache(empresaId, numeroId);
  writeCache(empresaId, numeroId, { conversations: mergeConversations(conversations, cache.conversations), messages: cache.messages });
}

function saveMessage(message: MensajeMock): void {
  const cache = readCache(message.empresaId, message.numeroId);
  const conversation = cache.conversations.find((item) => item.id === message.conversacionId);
  const updatedConversation: ConversacionMock = conversation || {
    id: message.conversacionId,
    empresaId: message.empresaId,
    numeroId: message.numeroId,
    contactoId: `contact_${message.conversacionId}`,
    contactoNombre: message.nombreEmisor,
    contactoTelefono: '',
    ultimoMensaje: message.contenido,
    ultimoMensajeTimestamp: message.timestamp,
    noLeidos: 0,
    estado: 'human',
    agenteAsignadoId: 'usr_carlos_morales',
    agenteAsignadoNombre: 'Carlos Morales',
    etiquetas: ['WhatsApp'],
  };
  const updatedMessages = mergeMessages(cache.messages[message.conversacionId] || [], [message]);
  const messages = { ...cache.messages, [message.conversacionId]: updatedMessages };
  writeCache(message.empresaId, message.numeroId, {
    conversations: mergeConversations([{ ...updatedConversation, ultimoMensaje: message.contenido, ultimoMensajeTimestamp: message.timestamp }], cache.conversations),
    messages,
  });
}

export const inboxApi = {
  async getConversaciones(empresaId: string, numeroId: string): Promise<ConversacionMock[]> {
    const cache = readCache(empresaId, numeroId);
    if (!useMocks) {
      try {
        const remote = await apiClient.get<BackendConversation[]>('/conversations', { empresaId, numeroId });
        if (remote.length) {
          const conversations = mergeConversations(remote.map((value) => mapConversation(value, empresaId, numeroId)), cache.conversations);
          saveConversations(empresaId, numeroId, conversations);
          return conversations;
        }
      } catch {
        // Usar los chats locales mientras se actualiza el backend publicado.
      }
    }
    const local = await mockApi.getConversaciones(empresaId, numeroId);
    const conversations = mergeConversations(local, cache.conversations);
    saveConversations(empresaId, numeroId, conversations);
    return conversations;
  },

  async getMensajes(
    empresaId: string,
    numeroId: string,
    conversacionId: string
  ): Promise<MensajeMock[]> {
    const cache = readCache(empresaId, numeroId);
    if (!useMocks) {
      try {
        const remote = await apiClient.get<BackendMessage[]>('/messages', {
          empresaId,
          numeroId,
          params: { conversation_id: conversacionId },
        });
        const messages = mergeMessages(remote.map((value) => mapMessage(value, empresaId, numeroId)), cache.messages[conversacionId] || []);
        if (messages.length) {
          writeCache(empresaId, numeroId, { conversations: cache.conversations, messages: { ...cache.messages, [conversacionId]: messages } });
          return messages;
        }
      } catch {
        // Usar el historial local mientras se actualiza el backend publicado.
      }
    }
    const local = await mockApi.getMensajes(empresaId, numeroId, conversacionId);
    const messages = mergeMessages(local, cache.messages[conversacionId] || []);
    if (messages.length) {
      writeCache(empresaId, numeroId, { conversations: cache.conversations, messages: { ...cache.messages, [conversacionId]: messages } });
    }
    return messages;
  },

  async enviarMensaje(
    empresaId: string,
    numeroId: string,
    conversacionId: string,
    contenido: string,
    remitente: 'agent' | 'bot' = 'agent',
    nombreEmisor: string = 'Carlos Morales',
    contactoTelefono?: string
  ): Promise<MensajeMock> {
    if (!useMocks && contactoTelefono) {
      const to = contactoTelefono.replace(/\D/g, '');
      try {
        const remote = await apiClient.post<BackendMessage>('/messages', {
          to,
          message: contenido,
          conversation_id: conversacionId,
        }, { empresaId, numeroId });
        const message = mapMessage(remote, empresaId, numeroId);
        saveMessage(message);
        return message;
      } catch (error) {
        // Compatibilidad con el backend anterior, que solo expone /send.
        await apiClient.post('/send', { to, message: contenido }, { empresaId, numeroId });
        const timestamp = new Date().toISOString();
        const message: MensajeMock = {
          id: `msg_${Date.now()}`,
          conversacionId,
          empresaId,
          numeroId,
          remitente,
          nombreEmisor,
          contenido,
          timestamp,
          estado: 'enviado',
          tipo: 'texto',
        };
        saveMessage(message);
        return message;
      }
    }
    const message = await mockApi.enviarMensaje(empresaId, numeroId, conversacionId, contenido, remitente, nombreEmisor);
    saveMessage(message);
    return message;
  },

  async cambiarEstadoConversacion(
    empresaId: string,
    conversacionId: string,
    estado: 'bot' | 'human' | 'closed',
    agente?: { id: string; nombre: string } | null
  ): Promise<ConversacionMock> {
    return mockApi.actualizarEstadoConversacion(empresaId, conversacionId, estado, agente);
  },

  async toggleFavorito(
    empresaId: string,
    conversacionId: string
  ): Promise<ConversacionMock> {
    const updated = await mockApi.toggleFavorito(empresaId, conversacionId);
    const cache = readCache(empresaId, updated.numeroId);
    const newConvs = cache.conversations.map((c) => (c.id === conversacionId ? updated : c));
    writeCache(empresaId, updated.numeroId, { conversations: newConvs, messages: cache.messages });
    return updated;
  },

  async getContactos(empresaId: string): Promise<ContactoMock[]> {
    if (!useMocks) {
      try {
        const remote = await apiClient.get<BackendConversation[]>('/conversations', { empresaId });
        if (remote.length) {
          return remote.map((value) => ({
            id: `contact_${value.contactoTelefono}`,
            empresaId,
            nombre: value.contactoNombre,
            telefono: `+${value.contactoTelefono}`,
            email: '', organizacion: '', tags: [], notas: '', estado: 'activo', origen: 'whatsapp',
            fechaCreacion: new Date().toISOString(),
          }));
        }
      } catch {
        // Usar los contactos locales mientras se actualiza el backend publicado.
      }
    }
    return mockApi.getContactos(empresaId);
  },
};

