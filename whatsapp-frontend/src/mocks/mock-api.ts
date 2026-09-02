import { EMPRESAS_MOCK, EmpresaMock } from './data/empresas.mock';
import { NUMEROS_MOCK, NumeroMock } from './data/numeros.mock';
import { CONTACTOS_MOCK, ContactoMock } from './data/contactos.mock';
import { CONVERSACIONES_MOCK, ConversacionMock } from './data/conversaciones.mock';
import { MENSAJES_MOCK, MensajeMock } from './data/mensajes.mock';
import { AUTOMATIZACIONES_MOCK, AutomatizacionMock } from './data/automatizaciones.mock';
import { CAMPAÑAS_MOCK, CampañaMock } from './data/campañas.mock';
import { EQUIPO_MOCK, MiembroEquipoMock } from './data/equipo.mock';
import { ANALYTICS_MOCK, AnalyticsMock } from './data/analytics.mock';
import { generateId } from './generators/mock-generators';

// In-memory state so actions (send message, toggle, edit) persist during the session
let empresas = [...EMPRESAS_MOCK];
let numeros = [...NUMEROS_MOCK];
let contactos = [...CONTACTOS_MOCK];
let conversaciones = [...CONVERSACIONES_MOCK];
let mensajes = [...MENSAJES_MOCK];
let automatizaciones = [...AUTOMATIZACIONES_MOCK];
let campañas = [...CAMPAÑAS_MOCK];
let equipo = [...EQUIPO_MOCK];

function simulateLatency<T>(data: T, delayMs: number = 180): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delayMs);
  });
}

export const mockApi = {
  // Empresas / Tenants
  async getEmpresas(): Promise<EmpresaMock[]> {
    return simulateLatency(empresas);
  },

  async getEmpresaById(empresaId: string): Promise<EmpresaMock> {
    const emp = empresas.find((e) => e.id === empresaId);
    if (!emp) throw new Error(`Empresa no encontrada: ${empresaId}`);
    return simulateLatency(emp);
  },

  // Números WhatsApp por Empresa
  async getNumeros(empresaId: string): Promise<NumeroMock[]> {
    const filtered = numeros.filter((n) => n.empresaId === empresaId);
    return simulateLatency(filtered);
  },

  async actualizarEstadoNumero(numeroId: string, estado: 'conectado' | 'desconectado' | 'pendiente_verificacion'): Promise<NumeroMock> {
    const idx = numeros.findIndex((n) => n.id === numeroId);
    if (idx === -1) throw new Error('Número no encontrado');
    numeros[idx] = { ...numeros[idx], estado };
    return simulateLatency(numeros[idx]);
  },

  // Conversaciones
  async getConversaciones(empresaId: string, numeroId: string): Promise<ConversacionMock[]> {
    const filtered = conversaciones.filter(
      (c) => c.empresaId === empresaId && c.numeroId === numeroId
    );
    return simulateLatency(filtered);
  },

  async actualizarEstadoConversacion(
    empresaId: string,
    conversacionId: string,
    estado: 'bot' | 'human' | 'closed',
    agente?: { id: string; nombre: string } | null
  ): Promise<ConversacionMock> {
    const idx = conversaciones.findIndex(
      (c) => c.id === conversacionId && c.empresaId === empresaId
    );
    if (idx === -1) throw new Error('Conversación no encontrada');

    conversaciones[idx] = {
      ...conversaciones[idx],
      estado,
      agenteAsignadoId: agente ? agente.id : null,
      agenteAsignadoNombre: agente ? agente.nombre : null,
    };

    return simulateLatency(conversaciones[idx]);
  },

  // Mensajes
  async getMensajes(empresaId: string, numeroId: string, conversacionId: string): Promise<MensajeMock[]> {
    const filtered = mensajes.filter(
      (m) =>
        m.empresaId === empresaId &&
        m.numeroId === numeroId &&
        m.conversacionId === conversacionId
    );
    return simulateLatency(filtered);
  },

  async enviarMensaje(
    empresaId: string,
    numeroId: string,
    conversacionId: string,
    contenido: string,
    remitente: 'agent' | 'bot' = 'agent',
    nombreEmisor: string = 'Agente Actual'
  ): Promise<MensajeMock> {
    const nuevoMensaje: MensajeMock = {
      id: generateId('msg'),
      conversacionId,
      empresaId,
      numeroId,
      remitente,
      nombreEmisor,
      contenido,
      timestamp: new Date().toISOString(),
      estado: 'enviado',
      tipo: 'texto',
    };

    mensajes.push(nuevoMensaje);

    // Actualizar último mensaje de la conversación
    const convIdx = conversaciones.findIndex((c) => c.id === conversacionId);
    if (convIdx !== -1) {
      conversaciones[convIdx] = {
        ...conversaciones[convIdx],
        ultimoMensaje: contenido,
        ultimoMensajeTimestamp: nuevoMensaje.timestamp,
      };
    }

    return simulateLatency(nuevoMensaje);
  },

  // Inyección de mensaje entrante (simulador)
  agregarMensajeEntrante(mensaje: MensajeMock): void {
    mensajes.push(mensaje);
    const convIdx = conversaciones.findIndex((c) => c.id === mensaje.conversacionId);
    if (convIdx !== -1) {
      conversaciones[convIdx] = {
        ...conversaciones[convIdx],
        ultimoMensaje: mensaje.contenido,
        ultimoMensajeTimestamp: mensaje.timestamp,
        noLeidos: conversaciones[convIdx].noLeidos + 1,
      };
    }
  },

  // Contactos
  async getContactos(empresaId: string): Promise<ContactoMock[]> {
    const filtered = contactos.filter((c) => c.empresaId === empresaId);
    return simulateLatency(filtered);
  },

  async crearContacto(empresaId: string, data: Omit<ContactoMock, 'id' | 'empresaId' | 'fechaCreacion'>): Promise<ContactoMock> {
    const nuevo: ContactoMock = {
      id: generateId('cnt'),
      empresaId,
      fechaCreacion: new Date().toISOString(),
      ...data,
    };
    contactos.push(nuevo);
    return simulateLatency(nuevo);
  },

  async actualizarContacto(empresaId: string, contactoId: string, data: Partial<ContactoMock>): Promise<ContactoMock> {
    const idx = contactos.findIndex((c) => c.id === contactoId && c.empresaId === empresaId);
    if (idx === -1) throw new Error('Contacto no encontrado');
    contactos[idx] = { ...contactos[idx], ...data };
    return simulateLatency(contactos[idx]);
  },

  // Automatizaciones
  async getAutomatizaciones(empresaId: string, numeroId: string): Promise<AutomatizacionMock[]> {
    const filtered = automatizaciones.filter(
      (a) => a.empresaId === empresaId && a.numeroId === numeroId
    );
    return simulateLatency(filtered);
  },

  async toggleAutomatizacion(empresaId: string, autoId: string, activo: boolean): Promise<AutomatizacionMock> {
    const idx = automatizaciones.findIndex((a) => a.id === autoId && a.empresaId === empresaId);
    if (idx === -1) throw new Error('Automatización no encontrada');
    automatizaciones[idx] = { ...automatizaciones[idx], activo };
    return simulateLatency(automatizaciones[idx]);
  },

  // Campañas
  async getCampañas(empresaId: string, numeroId: string): Promise<CampañaMock[]> {
    const filtered = campañas.filter((c) => c.empresaId === empresaId && c.numeroId === numeroId);
    return simulateLatency(filtered);
  },

  async crearCampaña(empresaId: string, numeroId: string, data: Omit<CampañaMock, 'id' | 'empresaId' | 'numeroId' | 'enviados' | 'entregados' | 'leidos' | 'fallidos' | 'estado' | 'fechaInicio'>): Promise<CampañaMock> {
    const nueva: CampañaMock = {
      id: generateId('cmp'),
      empresaId,
      numeroId,
      ...data,
      enviados: 0,
      entregados: 0,
      leidos: 0,
      fallidos: 0,
      estado: 'programada',
      fechaInicio: new Date().toISOString(),
    };
    campañas.push(nueva);
    return simulateLatency(nueva);
  },

  // Equipo
  async getEquipo(empresaId: string): Promise<MiembroEquipoMock[]> {
    const filtered = equipo.filter((m) => m.empresaId === empresaId);
    return simulateLatency(filtered);
  },

  // Analytics
  async getAnalytics(empresaId: string, numeroId: string): Promise<AnalyticsMock> {
    const key = `${empresaId}_${numeroId}`;
    if (ANALYTICS_MOCK[key]) {
      return simulateLatency(ANALYTICS_MOCK[key]);
    }
    // Fallback genérico si no hay mock específico
    return simulateLatency({
      empresaId,
      numeroId,
      totalMensajesHoy: 120,
      conversacionesAbiertas: 3,
      tiempoRespuestaPromedioSegundos: 60,
      tasaResolucionBot: 50,
      tasaResolucionHumano: 50,
      mensajesPorDia: [
        { label: 'Lun', valor: 100 },
        { label: 'Mar', valor: 110 },
        { label: 'Mié', valor: 120 },
        { label: 'Jue', valor: 90 },
        { label: 'Vie', valor: 130 },
        { label: 'Sáb', valor: 30 },
        { label: 'Dom', valor: 15 },
      ],
      volumenPorHora: [
        { label: '09:00', valor: 20 },
        { label: '12:00', valor: 45 },
        { label: '15:00', valor: 35 },
        { label: '18:00', valor: 20 },
      ],
      distribucionCanales: [{ canal: 'WhatsApp Business API', porcentaje: 100 }],
    });
  },
};

