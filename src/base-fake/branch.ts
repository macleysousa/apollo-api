import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

class BranchFakeRepository {
  find(): EmpresaEntity[] {
    const branch = new EmpresaEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      nome: 'Branch Test',
      nomeFantasia: 'Fantasy Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return [branch];
  }

  findOne(): EmpresaEntity {
    const branch = new EmpresaEntity({
      id: 1,
      cnpj: '01.248.473/0001-75',
      nome: 'Branch Test',
      nomeFantasia: 'Fantasy Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return branch;
  }

  findTerminais(): TerminalEntity[] {
    const terminal = new TerminalEntity({
      id: 1,
      empresaId: 1,
      nome: 'Terminal Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [terminal];
  }

  findOneTerminal(): TerminalEntity {
    const terminal = new TerminalEntity({
      id: 1,
      empresaId: 1,
      nome: 'Terminal Test',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return terminal;
  }
}

const branchFakeRepository = new BranchFakeRepository();
export { branchFakeRepository };
