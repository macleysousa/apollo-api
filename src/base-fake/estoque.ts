import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

class EstoqueFakeRepository {
  find(): EstoqueView[] {
    return [this.findOne()];
  }

  findOne(): EstoqueView {
    const produto = new EstoqueView({
      empresaId: 1,
      referenciaId: 1,
      referenciaIdExterno: '1',
      produtoId: 1,
      produtoIdExterno: '1',
      nome: 'Produto 1',
      corId: 1,
      corNome: 'Cor 1',
      tamanhoId: 1,
      tamanhoNome: 'Tamanho 1',
      saldo: 1,
      unidadeMedida: 'UN',
      atualizadoEm: new Date('2021-01-01T00:00:00.000Z'),
    });
    return produto;
  }

  findPaginate(): PaginatedDTO<EstoqueView>[] {
    const item: PaginatedDTO<EstoqueView> = {
      items: this.find(),
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
}

const estoqueFakeRepository = new EstoqueFakeRepository();
export { estoqueFakeRepository };
