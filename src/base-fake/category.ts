import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SizeEntity } from 'src/modules/size/entities/size.entity';

class CategoryFakeRepository {
  find(): CategoryEntity[] {
    const size = new CategoryEntity({
      id: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [size];
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
}

const categoryFakeRepository = new CategoryFakeRepository();
export { categoryFakeRepository };
