import { CaixaEntity } from 'src/modules/caixa/entities/caixa.entity';
import { CaixaSituacao } from 'src/modules/caixa/enum/caixa-situacao.enum';

class CaixaFakeRepository {
  caixas(): CaixaEntity[] {
    return [this.caixaAberto(), this.caixaFechado()];
  }

  caixaAberto(): CaixaEntity {
    const item = new CaixaEntity({
      id: 1,
      empresaId: 1,
      terminalId: 1,
      abertura: new Date('2022-10-15T11:13:18.000Z'),
      operadorAberturaId: 1,
      valorAbertura: 100,
      situacao: CaixaSituacao.aberto,
    });

    return item;
  }

  caixaFechado(): CaixaEntity {
    const size = new CaixaEntity({
      id: 1,
      empresaId: 1,
      terminalId: 1,
      abertura: new Date('2022-10-15T11:13:18.000Z'),
      operadorAberturaId: 1,
      valorAbertura: 100,
      fechamento: new Date('2022-10-15T11:13:18.000Z'),
      operadorFechamentoId: 1,
      valorFechamento: 100,
      situacao: CaixaSituacao.fechado,
    });

    return size;
  }
}

const caixaFakeRepository = new CaixaFakeRepository();
export { caixaFakeRepository };
