import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { ProductEntity } from 'src/modules/product/entities/product.entity';

class ProductFakeRepository {
  find(): ProductEntity[] {
    const value = new ProductEntity({
      id: 1,
      name: 'P',
      externalId: 'REF001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [value];
  }

  findPaginate(): PaginatedDTO<ProductEntity>[] {
    const item: PaginatedDTO<ProductEntity> = {
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

  findOne(): ProductEntity {
    const value = new ProductEntity({
      id: 1,
      name: 'P',
      externalId: 'REF001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return value;
  }
}

const productFakeRepository = new ProductFakeRepository();
export { productFakeRepository };
