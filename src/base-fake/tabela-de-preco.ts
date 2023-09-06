import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { TabelaDePrecoEntity } from 'src/modules/tabela-de-preco/entities/tabela-de-preco.entity';
import { PrecoReferenciaView } from 'src/modules/tabela-de-preco/referencia/views/referencia.view';

class TableaDePrecoFakeRepository {
  find(): TabelaDePrecoEntity[] {
    const item = new TabelaDePrecoEntity({
      id: 1,
      nome: 'Atacado',
      terminador: 0.9,
      inativa: true,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [item];
  }

  findOne(): TabelaDePrecoEntity {
    const item = new TabelaDePrecoEntity({
      id: 1,
      nome: 'Atacado',
      terminador: 0.9,
      inativa: true,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return item;
  }

  findView(): PrecoReferenciaView[] {
    const item = new PrecoReferenciaView({
      tabelaDePrecoId: 1,
      referenciaId: 1,
      referenciaIdExterno: '0001',
      referenciaNome: 'REF 0001',
      operadorId: 1,
      valor: 3.9,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [item];
  }

  findViewPaginate(): PaginatedDTO<PrecoReferenciaView>[] {
    const item: PaginatedDTO<PrecoReferenciaView> = {
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

  findOneView(): PrecoReferenciaView {
    const item = new PrecoReferenciaView({
      tabelaDePrecoId: 1,
      referenciaId: 1,
      referenciaIdExterno: '0001',
      referenciaNome: 'REF 0001',
      operadorId: 1,
      valor: 3.9,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return item;
  }
}

const tableaDePrecoFakeRepository = new TableaDePrecoFakeRepository();
export { tableaDePrecoFakeRepository };
