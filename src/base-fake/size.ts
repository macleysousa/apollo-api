import { SizeEntity } from 'src/modules/size/entities/size.entity';

class SizeFakeRepository {
  find(): SizeEntity[] {
    const size = new SizeEntity({
      id: 1,
      name: 'P',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [size];
  }

  findOne(): SizeEntity {
    const size = new SizeEntity({
      id: 1,
      name: 'P',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return size;
  }
}

const sizeFakeRepository = new SizeFakeRepository();
export { sizeFakeRepository };
