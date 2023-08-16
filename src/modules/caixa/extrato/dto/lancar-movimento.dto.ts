import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';

import { TipoHistorico } from '../enum/tipo-historico.enum';

export class LancarMovimento {
  tipoDocumento: TipoDocumento;

  tipoHistorico: TipoHistorico;

  tipoMovimento: TipoMovimento;

  valor: number;

  faturaId?: number;

  faturaParcela?: number;

  observacao?: string;

  constructor(data?: LancarMovimento) {
    Object.assign(this, data);
  }
}
