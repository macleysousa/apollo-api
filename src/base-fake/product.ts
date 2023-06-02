import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { ProdutoEntity } from 'src/modules/produto/entities/produto.entity';

class ProductFakeRepository {
  find(): ProdutoEntity[] {
    const value = new ProdutoEntity({
      id: 1,
      idExterno: 'REF001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [value];
  }

  findPaginate(): PaginatedDTO<ProdutoEntity>[] {
    const item: PaginatedDTO<ProdutoEntity> = {
      items: productFakeRepository.find(),
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

  findOne(): ProdutoEntity {
    const value = new ProdutoEntity({
      id: 1,
      idExterno: 'REF001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return value;
  }
}

const productFakeRepository = new ProductFakeRepository();
export { productFakeRepository };
