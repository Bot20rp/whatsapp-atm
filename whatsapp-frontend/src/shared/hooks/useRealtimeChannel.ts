import { useEffect } from 'react';
import { RealtimeEventType, RealtimeEvent, webSocketClient } from '../../infrastructure/realtime/websocket-client';
import { mockRealtimeService } from '../../mocks/mock-realtime';

export function useRealtimeChannel<T = any>(
  eventType: RealtimeEventType,
  onEvent: (event: RealtimeEvent<T>) => void,
  empresaId?: string,
  numeroId?: string
) {
  useEffect(() => {
    const isMock = import.meta.env.VITE_USE_MOCKS !== 'false';

    const handler = (event: RealtimeEvent<T>) => {
      // Filtrar por empresa y número si están especificados
      if (empresaId && event.empresaId !== empresaId) return;
      if (numeroId && event.numeroId !== numeroId) return;
      onEvent(event);
    };

    if (isMock) {
      const unsubscribe = mockRealtimeService.subscribe(eventType, handler);
      return () => unsubscribe();
    } else {
      const unsubscribe = webSocketClient.subscribe(eventType, handler);
      return () => unsubscribe();
    }
  }, [eventType, onEvent, empresaId, numeroId]);
}

