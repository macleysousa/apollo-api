import { ReferenceEntity } from 'src/modules/reference/entities/reference.entity';

class ReferenceFakeRepository {
  find(): ReferenceEntity[] {
    const item = new ReferenceEntity({
      id: 1,
      name: 'reference',
      externalId: '0001',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [item];
  }

  findOne(): ReferenceEntity {
    const item = new ReferenceEntity({
      id: 1,
      name: 'reference',
      externalId: '0001',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
    });

    return item;
  }
}

const referenceFakeRepository = new ReferenceFakeRepository();
export { referenceFakeRepository };
