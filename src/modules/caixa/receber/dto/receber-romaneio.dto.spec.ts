import { plainToClass } from 'class-transformer';

import { PagamentoDto } from './pagamento.dto';
import { ReceberRomaneioDto } from './receber-romaneio.dto';

describe('ReceberRomaneioDto', () => {
  it('should have the expected properties', () => {
    const dto = new ReceberRomaneioDto({
      romaneioId: 1,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
    });

    expect(dto).toHaveProperty('romaneioId');
    expect(dto).toHaveProperty('formasDePagamento');
  });

  it('should create a DTO object with the expected values', () => {
    const data = {
      romaneioId: 1,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
    };
    const dto = new ReceberRomaneioDto(data);

    expect(dto.romaneioId).toEqual(data.romaneioId);
    expect(dto.formasDePagamento).toEqual(data.formasDePagamento);
  });

  it('should convert to a plain object', () => {
    const data = {
      romaneioId: 1,
      formasDePagamento: [{ valor: 100.0 }] as PagamentoDto[],
    };
    const dto = plainToClass(ReceberRomaneioDto, data);

    expect(dto).toBeInstanceOf(ReceberRomaneioDto);
  });
});
