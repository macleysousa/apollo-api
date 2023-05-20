import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

class BranchFakeRepository {
  find(): EmpresaEntity[] {
    const branch = new EmpresaEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      name: 'Branch Test',
      fantasyName: 'Fantasy Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return [branch];
  }

  findOne(): EmpresaEntity {
    const branch = new EmpresaEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      name: 'Branch Test',
      fantasyName: 'Fantasy Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return branch;
  }
}

const branchFakeRepository = new BranchFakeRepository();
export { branchFakeRepository };
