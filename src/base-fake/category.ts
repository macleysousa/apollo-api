import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SubCategoryEntity } from 'src/modules/category/sub/entities/sub.entity';
import { SizeEntity } from 'src/modules/size/entities/size.entity';

class CategoryFakeRepository {
  find(): CategoryEntity[] {
    const item = new CategoryEntity({
      id: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [item];
  }

  findOne(): CategoryEntity {
    const size = new CategoryEntity({
      id: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return size;
  }

  findSub(): SubCategoryEntity[] {
    const item = new SubCategoryEntity({
      id: 1,
      categoryId: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [item];
  }

  findSubOne(): SubCategoryEntity {
    const item = new SubCategoryEntity({
      id: 1,
      categoryId: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return item;
  }
}

const categoryFakeRepository = new CategoryFakeRepository();
export { categoryFakeRepository };
