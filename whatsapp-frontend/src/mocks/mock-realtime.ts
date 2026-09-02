import { RealtimeEventType, RealtimeEvent, RealtimeEventHandler } from '../infrastructure/realtime/websocket-client';
import { mockApi } from './mock-api';
import { generateId, pickRandom } from './generators/mock-generators';
import { MensajeMock } from './data/mensajes.mock';

const SAMPLE_INCOMING_MESSAGES = [
  'Hola, quisiera conocer más sobre sus planes corporativos.',
  '¿Tienen disponibilidad para una llamada técnica hoy?',
  'Muchas gracias por la atención, me quedó todo muy claro.',
  '¿Pueden enviarme la factura proforma actualizada?',
  'Hola, necesito asistencia con un pedido urgente.',
  'Buenas tardes, confirmo la recepción de los documentos.',
];

class MockRealtimeService {
  private intervalId: any = null;
  private isRunning: boolean = false;
  private listeners: Map<RealtimeEventType, Set<RealtimeEventHandler>> = new Map();
  private intervalMs: number = 20000; // Cada 20 segundos para un flujo natural sin saturar

  start(empresaId: string, numeroId: string): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.generateSimulatedEvent(empresaId, numeroId);
    }, this.intervalMs);
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  subscribe(type: RealtimeEventType, handler: RealtimeEventHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);

    return () => {
      this.listeners.get(type)?.delete(handler);
    };
  }

  emit(type: RealtimeEventType, event: RealtimeEvent): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((h) => h(event));
    }
  }

  private async generateSimulatedEvent(empresaId: string, numeroId: string): Promise<void> {
    try {
      const convs = await mockApi.getConversaciones(empresaId, numeroId);
      if (!convs.length) return;

      const targetConv = pickRandom(convs);
      const text = pickRandom(SAMPLE_INCOMING_MESSAGES);

      const nuevoMensaje: MensajeMock = {
        id: generateId('msg_rt'),
        conversacionId: targetConv.id,
        empresaId,
        numeroId,
        remitente: 'customer',
        nombreEmisor: targetConv.contactoNombre,
        contenido: text,
        timestamp: new Date().toISOString(),
        estado: 'entregado',
        tipo: 'texto',
      };

      // Registrar en el mockApi en memoria
      mockApi.agregarMensajeEntrante(nuevoMensaje);

      // Emitir evento
      this.emit('new_message', {
        type: 'new_message',
        empresaId,
        numeroId,
        timestamp: nuevoMensaje.timestamp,
        payload: {
          mensaje: nuevoMensaje,
          conversacionId: targetConv.id,
        },
      });
    } catch {
      // Ignorar errores en ciclo de simulación
    }
  }
}

export const mockRealtimeService = new MockRealtimeService();

