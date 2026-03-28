import { plainToClass } from 'class-transformer';

import { PagamentoDto } from './pagamento.dto';
import { ReceberAdiantamentoDto } from './receber-adiantamento.dto';

describe('ReceberAdiantamentoDto', () => {
  it('should have the expected properties', () => {
    const dto = new ReceberAdiantamentoDto({
      pessoaId: 1,
      valor: 100.0,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
      observacao: 'Observação',
    });

    expect(dto).toHaveProperty('pessoaId');
    expect(dto).toHaveProperty('valor');
    expect(dto).toHaveProperty('formasDePagamento');
    expect(dto).toHaveProperty('observacao');
  });

  it('should create a DTO object with the expected values', () => {
    const data = {
      pessoaId: 1,
      valor: 100.0,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
      observacao: 'Observação',
    };
    const dto = new ReceberAdiantamentoDto(data);

    expect(dto.pessoaId).toEqual(data.pessoaId);
    expect(dto.valor).toEqual(data.valor);
    expect(dto.formasDePagamento).toEqual(data.formasDePagamento);
    expect(dto.observacao).toEqual(data.observacao);
  });

  it('should convert to a plain object', () => {
    const data = {
      pessoaId: 1,
      valor: 100.0,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
      observacao: 'Observação',
    };
    const dto = plainToClass(ReceberAdiantamentoDto, data);

    expect(dto).toBeInstanceOf(ReceberAdiantamentoDto);
  });
});
