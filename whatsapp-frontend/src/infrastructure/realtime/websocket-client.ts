export type RealtimeEventType = 
  | 'new_message' 
  | 'status_update' 
  | 'bot_handoff' 
  | 'conversation_closed'
  | 'connection_change';

export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  empresaId: string;
  numeroId: string;
  timestamp: string;
  payload: T;
}

export type RealtimeEventHandler<T = any> = (event: RealtimeEvent<T>) => void;

export class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private listeners: Map<RealtimeEventType, Set<RealtimeEventHandler>> = new Map();
  private reconnectInterval: number = 5000;
  private isExplicitlyClosed: boolean = false;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/realtime';
  }

  connect(token?: string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    const wsUrl = token ? `${this.url}?token=${encodeURIComponent(token)}` : this.url;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // Connected to real WebSocket
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as RealtimeEvent;
          this.emit(parsed.type, parsed);
        } catch {
          // Failed to parse WebSocket message
        }
      };

      this.ws.onclose = () => {
        if (!this.isExplicitlyClosed) {
          setTimeout(() => this.connect(token), this.reconnectInterval);
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      // Handle connection error gracefully
    }
  }

  disconnect(): void {
    this.isExplicitlyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
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

  private emit(type: RealtimeEventType, event: RealtimeEvent): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((h) => h(event));
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export const webSocketClient = new WebSocketClient();

