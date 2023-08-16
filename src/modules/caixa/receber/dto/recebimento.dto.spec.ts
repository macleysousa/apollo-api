import { RecebimentoDto } from './recebimento.dto';

describe('RecebimentoDto', () => {
  it('should have the expected properties', () => {
    const dto = new RecebimentoDto({
      pessoaId: 1,
      valor: 100.0,
      romaneioId: 2,
      observacao: 'Observação',
    });

    expect(dto).toHaveProperty('pessoaId');
    expect(dto).toHaveProperty('valor');
    expect(dto).toHaveProperty('romaneioId');
    expect(dto).toHaveProperty('observacao');
  });

  it('should create a DTO object with the expected values', () => {
    const data = {
      pessoaId: 1,
      valor: 100.0,
      romaneioId: 2,
      observacao: 'Observação',
    };
    const dto = new RecebimentoDto(data);

    expect(dto.pessoaId).toEqual(data.pessoaId);
    expect(dto.valor).toEqual(data.valor);
    expect(dto.romaneioId).toEqual(data.romaneioId);
    expect(dto.observacao).toEqual(data.observacao);
  });
});
