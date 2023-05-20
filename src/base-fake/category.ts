import { CategoriaEntity } from 'src/modules/categoria/entities/category.entity';
import { SubCategoriaEntity } from 'src/modules/categoria/sub/entities/sub.entity';
import { TamanhoEntity } from 'src/modules/tamanho/entities/tamanho.entity';

class CategoryFakeRepository {
  find(): CategoriaEntity[] {
    const item = new CategoriaEntity({
      id: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });

    return [item];
  }

  findOne(): CategoriaEntity {
    const size = new CategoriaEntity({
      id: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });

    return size;
  }

  findSub(): SubCategoriaEntity[] {
    const item = new SubCategoriaEntity({
      id: 1,
      categoriaId: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });

    return [item];
  }

  findSubOne(): SubCategoriaEntity {
    const item = new SubCategoriaEntity({
      id: 1,
      categoriaId: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });

    return item;
  }
}

const categoryFakeRepository = new CategoryFakeRepository();
export { categoryFakeRepository };
