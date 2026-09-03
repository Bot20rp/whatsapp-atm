import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { useRealtimeChannel } from '../../../shared/hooks/useRealtimeChannel';
import { inboxApi } from '../api/inbox.api';
import { ConversacionMock, MensajeMock, ContactoMock, ConversationFilter } from '../types/inbox.types';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { ContactSidebar } from '../components/ContactSidebar';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { Inbox } from 'lucide-react';

export const InboxPage: React.FC = () => {
  const { empresaActual, numeroActual } = useTenant();

  const [conversaciones, setConversaciones] = useState<ConversacionMock[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversacionMock | null>(null);
  const [mensajes, setMensajes] = useState<MensajeMock[]>([]);
  const [contactos, setContactos] = useState<ContactoMock[]>([]);
  const [selectedContacto, setSelectedContacto] = useState<ContactoMock | null>(null);

  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [filtro, setFiltro] = useState<ConversationFilter>('all');
  const [busqueda, setBusqueda] = useState('');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Cargar conversaciones al cambiar de empresa o número
  const cargarConversaciones = useCallback(async () => {
    if (!empresaActual || !numeroActual) return;
    try {
      setLoadingConv(true);
      const [convs, cnts] = await Promise.all([
        inboxApi.getConversaciones(empresaActual.id, numeroActual.id),
        inboxApi.getContactos(empresaActual.id),
      ]);

      setConversaciones(convs);
      setContactos(cnts);

      // Auto-seleccionar la primera conversación si existe
      if (convs.length > 0) {
        setSelectedConv(convs[0]);
        const cnt = cnts.find((c) => c.id === convs[0].contactoId) || null;
        setSelectedContacto(cnt);
      } else {
        setSelectedConv(null);
        setSelectedContacto(null);
        setMensajes([]);
      }
    } catch {
      // Error silencioso
    } finally {
      setLoadingConv(false);
    }
  }, [empresaActual?.id, numeroActual?.id]);

  useEffect(() => {
    cargarConversaciones();
  }, [cargarConversaciones]);

  useEffect(() => {
    if (import.meta.env.VITE_USE_MOCKS !== 'false' || !empresaActual || !numeroActual) return;

    const intervalId = window.setInterval(async () => {
      try {
        const convs = await inboxApi.getConversaciones(empresaActual.id, numeroActual.id);
        setConversaciones(convs);
        if (selectedConv) {
          const msgs = await inboxApi.getMensajes(empresaActual.id, numeroActual.id, selectedConv.id);
          setMensajes(msgs);
        }
      } catch {
        // Mantener los datos visibles mientras el backend se reinicia.
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [empresaActual?.id, numeroActual?.id, selectedConv?.id]);

  // Cargar mensajes cuando cambia la conversación seleccionada
  useEffect(() => {
    const cargarMensajes = async () => {
      if (!empresaActual || !numeroActual || !selectedConv) return;
      try {
        setLoadingMsg(true);
        const msgs = await inboxApi.getMensajes(
          empresaActual.id,
          numeroActual.id,
          selectedConv.id
        );
        setMensajes(msgs);

        // Asociar contacto
        const cnt = contactos.find((c) => c.id === selectedConv.contactoId) || null;
        setSelectedContacto(cnt);
      } finally {
        setLoadingMsg(false);
      }
    };

    cargarMensajes();
  }, [selectedConv?.id, empresaActual?.id, numeroActual?.id, contactos]);

  // Suscripción a eventos de tiempo real
  useRealtimeChannel(
    'new_message',
    (event) => {
      const { mensaje, conversacionId } = event.payload;

      // Si el mensaje es para la conversación actual en pantalla
      if (selectedConv && selectedConv.id === conversacionId) {
        setMensajes((prev) => [...prev, mensaje]);
      }

      // Actualizar lista de conversaciones
      setConversaciones((prev) =>
        prev.map((c) => {
          if (c.id === conversacionId) {
            return {
              ...c,
              ultimoMensaje: mensaje.contenido,
              ultimoMensajeTimestamp: mensaje.timestamp,
              noLeidos: selectedConv?.id === conversacionId ? 0 : c.noLeidos + 1,
            };
          }
          return c;
        })
      );
    },
    empresaActual?.id,
    numeroActual?.id
  );

  const handleSelectConv = (conv: ConversacionMock) => {
    setSelectedConv(conv);
    // Marcar como leídos
    setConversaciones((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, noLeidos: 0 } : c))
    );
  };

  const handleEnviarMensaje = async (contenido: string, remitente: 'agent' | 'bot' = 'agent') => {
    if (!empresaActual || !numeroActual || !selectedConv) return;

    const nuevo = await inboxApi.enviarMensaje(
      empresaActual.id,
      numeroActual.id,
      selectedConv.id,
      contenido,
      remitente,
      'Carlos Morales',
      selectedConv.contactoTelefono
    );

    setMensajes((prev) => [...prev, nuevo]);

    // Actualizar conversación
    setConversaciones((prev) =>
      prev.map((c) =>
        c.id === selectedConv.id
          ? {
              ...c,
              ultimoMensaje: contenido,
              ultimoMensajeTimestamp: nuevo.timestamp,
              estado: c.estado === 'closed' ? 'human' : c.estado,
            }
          : c
      )
    );

    if (selectedConv.estado === 'closed') {
      setSelectedConv((prev) => (prev ? { ...prev, estado: 'human' } : null));
    }
  };

  const handleCambiarEstado = async (nuevoEstado: 'bot' | 'human' | 'closed') => {
    if (!empresaActual || !selectedConv) return;

    const agente = nuevoEstado === 'human' ? { id: 'usr_1', nombre: 'Carlos Morales' } : null;

    const updated = await inboxApi.cambiarEstadoConversacion(
      empresaActual.id,
      selectedConv.id,
      nuevoEstado,
      agente
    );

    setSelectedConv(updated);
    setConversaciones((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  if (loadingConv) {
    return <Spinner text="Cargando conversaciones de la línea..." size="lg" />;
  }

  return (
    <div className="h-[calc(100vh-7.5rem)] flex border border-[#D1D8C9] rounded-lg overflow-hidden bg-white">
      {/* 1. Panel de Lista de Conversaciones */}
      <ConversationList
        conversaciones={conversaciones}
        selectedId={selectedConv?.id || null}
        onSelect={handleSelectConv}
        filtro={filtro}
        setFiltro={setFiltro}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      {/* 2. Panel Central de Mensajes */}
      {selectedConv ? (
        <div className="flex-1 flex overflow-hidden">
          {loadingMsg ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner text="Cargando mensajes..." />
            </div>
          ) : (
            <ChatWindow
              conversacion={selectedConv}
              mensajes={mensajes}
              onEnviarMensaje={handleEnviarMensaje}
              onCambiarEstado={handleCambiarEstado}
              onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
              sidebarAbierto={sidebarAbierto}
            />
          )}

          {/* 3. Panel Lateral de Contacto */}
          {sidebarAbierto && (
            <ContactSidebar
              contacto={selectedContacto}
              onClose={() => setSidebarAbierto(false)}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#F5F7F4]">
          <EmptyState
            icon={Inbox}
            title="Ninguna conversación seleccionada"
            description={`No hay chats abiertos en la línea "${numeroActual?.alias}". Cambie de línea en el encabezado superior o espere nuevos mensajes.`}
          />
        </div>
      )}
    </div>
  );
};

export default InboxPage;
