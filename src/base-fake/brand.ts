import { BrandEntity } from 'src/modules/brand/entities/brand.entity';

class BrandFakeRepository {
  find(): BrandEntity[] {
    const item = new BrandEntity({
      id: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [item];
  }

  findOne(): BrandEntity {
    const item = new BrandEntity({
      id: 1,
      name: 'Name',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });
    return item;
  }
}

const brandFakeRepository = new BrandFakeRepository();
export { brandFakeRepository };
