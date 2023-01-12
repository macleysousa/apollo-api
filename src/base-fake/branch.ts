import { BranchEntity } from 'src/modules/branch/entities/branch.entity';

class BranchFakeRepository {
  find(): BranchEntity[] {
    const branch = new BranchEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      name: 'Branch Test',
      fantasyName: 'Fantasy Test',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
    });
    return [branch];
  }

  findOne(): BranchEntity {
    const branch = new BranchEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      name: 'Branch Test',
      fantasyName: 'Fantasy Test',
      createdAt: new Date('2022-10-15T11:13:18.000Z'),
      updatedAt: new Date('2022-10-15T11:13:18.000Z'),
    });
    return branch;
  }
}

const branchFakeRepository = new BranchFakeRepository();
export { branchFakeRepository };
