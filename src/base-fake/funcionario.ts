import { FuncionarioEntity } from 'src/modules/funcionario/entities/funcionario.entity';

class FuncionarioFakeRepository {
  find(): FuncionarioEntity[] {
    const value = new FuncionarioEntity({ id: 1, nome: 'João', empresaId: 1, inativo: true });
    const value2 = new FuncionarioEntity({ id: 2, nome: 'Maria', empresaId: 1, inativo: false });

    return [value, value2];
  }

  findOne(): FuncionarioEntity {
    const value = this.find()[0];
    return value;
  }
}

const funcionarioFakeRepository = new FuncionarioFakeRepository();
export { funcionarioFakeRepository };
