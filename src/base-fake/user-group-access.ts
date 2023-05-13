import { UsuarioGrupoEntity } from 'src/modules/usuario/group-access/entities/grupo-acesso.entity';

class UserGroupAccessFakeRepository {
  find(): UsuarioGrupoEntity[] {
    const access = new UsuarioGrupoEntity({
      usuarioId: 1,
      empresaId: 1,
      grupoId: 1,
      operadorId: 1,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return [access];
  }

  findOne(): UsuarioGrupoEntity {
    const access = new UsuarioGrupoEntity({
      usuarioId: 1,
      empresaId: 1,
      grupoId: 1,
      operadorId: 1,
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });
    return access;
  }
}
const userGroupAccessFakeRepository = new UserGroupAccessFakeRepository();
export { userGroupAccessFakeRepository };
