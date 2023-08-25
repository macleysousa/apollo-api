import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioFreteEntity } from 'src/modules/romaneio/romaneio-frete/entities/romaneio-frete.entity';
import { TipoFrete } from 'src/commons/enum/tipo-frete';
import { RomaneioItemView } from 'src/modules/romaneio/romaneio-item/views/romaneio-item.view';
import { RomaneioView } from 'src/modules/romaneio/views/romaneio.view';

export class RomaneioFakeRepository {
  findView(): RomaneioView[] {
    const item = new RomaneioView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-05'),
      pessoaId: 1,
      pessoaNome: 'Pessoa 1',
      funcionarioId: 1,
      funcionarioNome: 'Funcionario 1',
      tabelaPrecoId: 1,
      modalidade: ModalidadeRomaneio.Saida,
      operacao: OperacaoRomaneio.Venda,
      situacao: SituacaoRomaneio.EmAndamento,
      pago: false,
      acertoConsignacao: false,
      quantidade: 1,
      valorBruto: 79.9,
      valorDesconto: 0.1,
      valorLiquido: 79.8,
      operadorId: 1,
      criadoEm: new Date('2023-06-05T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-05T11:13:18.000Z'),
    });

    return [item];
  }

  findViewPaginate(): PaginatedDTO<RomaneioView>[] {
    const item: PaginatedDTO<RomaneioView> = {
      items: this.findView(),
      meta: {
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 100,
        totalPages: 10,
      },
    };
    return [item];
  }

  findOneView(): RomaneioView {
    const item = new RomaneioView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-05'),
      pessoaId: 1,
      pessoaNome: 'Pessoa 1',
      funcionarioId: 1,
      funcionarioNome: 'Funcionario 1',
      tabelaPrecoId: 1,
      modalidade: ModalidadeRomaneio.Saida,
      operacao: OperacaoRomaneio.Venda,
      situacao: SituacaoRomaneio.EmAndamento,
      pago: false,
      acertoConsignacao: false,
      quantidade: 1,
      valorBruto: 79.9,
      valorDesconto: 0.1,
      valorLiquido: 79.8,
      operadorId: 1,
      criadoEm: new Date('2023-06-05T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-05T11:13:18.000Z'),
    });
    return item;
  }

  findViewItens(): RomaneioItemView[] {
    const item = new RomaneioItemView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-09'),
      referenciaId: 1,
      referenciaIdExterno: '1',
      referenciaNome: 'Referencia 1',
      produtoId: 1,
      produtoIdExterno: '1',
      corId: 1,
      corNome: 'Cor 1',
      tamanhoId: 1,
      tamanhoNome: 'Tamanho 1',
      modalidade: 'Saída',
      operacao: 'Venda',
      situacao: 'Em andamento',
      emPromocao: false,
      quantidade: 2,
      valorUnitario: 79.9,
      valorUnitDesconto: 0.1,
      valorTotalBruto: 159.8,
      valorTotalDesconto: 0.2,
      valorTotalLiquido: 159.6,
      cupomId: 1,
      operadorId: 1,
      criadoEm: new Date('2023-06-09T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-09T11:13:18.000Z'),
    });

    return [item];
  }

  findOneViewItem(): RomaneioItemView {
    const item = new RomaneioItemView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-09'),
      sequencia: 1,
      referenciaId: 1,
      referenciaIdExterno: '1',
      referenciaNome: 'Referencia 1',
      produtoId: 1,
      produtoIdExterno: '1',
      corId: 1,
      corNome: 'Cor 1',
      tamanhoId: 1,
      tamanhoNome: 'Tamanho 1',
      modalidade: 'Saída',
      operacao: 'Venda',
      situacao: 'Em andamento',
      emPromocao: false,
      quantidade: 2,
      valorUnitario: 79.9,
      valorUnitDesconto: 0.1,
      valorTotalBruto: 159.8,
      valorTotalDesconto: 0.2,
      valorTotalLiquido: 159.6,
      cupomId: 1,
      operadorId: 1,
      devolvido: 0,
      romaneioOrigemId: null,
      criadoEm: new Date('2023-06-09T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-09T11:13:18.000Z'),
    });

    return item;
  }

  findFrete(): RomaneioFreteEntity {
    return new RomaneioFreteEntity({
      empresaId: 1,
      romaneioId: 1,
      tipo: TipoFrete.CIF,
      valor: 1,
      prazo: 0,
      observacao: 'observacao',
      criadoEm: new Date('2023-06-09T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-09T11:13:18.000Z'),
    });
  }
}

const romaneioFakeRepository = new RomaneioFakeRepository();
export { romaneioFakeRepository };
