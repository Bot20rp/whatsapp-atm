import { NumeroMock } from '../../../mocks/data/numeros.mock';

export type { NumeroMock };

export interface AddNumberPayload {
  numero: string;
  alias: string;
  metaWabaId: string;
}

