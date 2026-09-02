import { ConversacionMock } from '../../../mocks/data/conversaciones.mock';
import { MensajeMock } from '../../../mocks/data/mensajes.mock';
import { ContactoMock } from '../../../mocks/data/contactos.mock';

export type { ConversacionMock, MensajeMock, ContactoMock };

export type ConversationFilter = 'all' | 'bot' | 'human' | 'closed';

