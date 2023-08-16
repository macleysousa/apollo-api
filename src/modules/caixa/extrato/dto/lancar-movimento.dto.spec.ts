import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';

import { TipoHistorico } from '../enum/tipo-historico.enum';
import { LancarMovimento } from './lancar-movimento.dto';

describe('LancarMovimento', () => {
  it('should have the expected properties', () => {
    const dto = new LancarMovimento({
      tipoDocumento: TipoDocumento.Adiantamento,
      tipoHistorico: TipoHistorico.Adiantamento,
      tipoMovimento: TipoMovimento.Credito,
      valor: 100.0,
    });

    expect(dto).toHaveProperty('tipoDocumento');
    expect(dto).toHaveProperty('tipoHistorico');
    expect(dto).toHaveProperty('tipoMovimento');
    expect(dto).toHaveProperty('valor');
    expect(dto).not.toHaveProperty('faturaId');
    expect(dto).not.toHaveProperty('faturaParcela');
    expect(dto).not.toHaveProperty('observacao');
  });

  it('should create a DTO object with the expected values', () => {
    const data = {
      tipoDocumento: TipoDocumento.Cartao,
      tipoHistorico: TipoHistorico.Venda,
      tipoMovimento: TipoMovimento.Credito,
      valor: 100.0,
      faturaId: 1,
      faturaParcela: 2,
      observacao: 'Observação',
    };
    const dto = new LancarMovimento(data);

    expect(dto.tipoDocumento).toEqual(data.tipoDocumento);
    expect(dto.tipoHistorico).toEqual(data.tipoHistorico);
    expect(dto.tipoMovimento).toEqual(data.tipoMovimento);
    expect(dto.valor).toEqual(data.valor);
    expect(dto.faturaId).toEqual(data.faturaId);
    expect(dto.faturaParcela).toEqual(data.faturaParcela);
    expect(dto.observacao).toEqual(data.observacao);
  });
});
