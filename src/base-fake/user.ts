import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';
import { UsuarioAcessoEntity } from 'src/modules/usuario/entities/usuario-acessos.entity';
import { UsuarioSituacao } from 'src/modules/usuario/enums/usuario-situacao.enum';
import { Role } from 'src/modules/usuario/enums/usuario-tipo.enum';
import { UsuarioTerminalEntity } from 'src/modules/usuario/terminal/entities/terminal.entity';
import { UsuarioTerminalView } from 'src/modules/usuario/terminal/views/terminal.view';

import { empresaFakeRepository } from './empresa';

class UserFakeRepository {
  find(): UsuarioEntity[] {
    const user = new UsuarioEntity();
    user.id = 1;
    user.usuario = 'username';
    user.senha = 'password';
    user.nome = 'john doe';
    user.tipo = Role.administrador;
    user.situacao = UsuarioSituacao.ativo;
    user.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    user.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return [user];
  }

  findOne(): UsuarioEntity {
    const user = new UsuarioEntity();
    user.id = 1;
    user.usuario = 'username';
    user.senha = 'password';
    user.nome = 'john doe';
    user.tipo = Role.sysadmin;
    user.situacao = UsuarioSituacao.ativo;
    user.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    user.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    user.terminais = [this.findOneTerminalView()];
    return user;
  }

  findAccesses(): UsuarioAcessoEntity[] {
    const access = new UsuarioAcessoEntity({
      id: 1,
      empresaId: 1,
      grupoId: 1,
      grupoNome: 'Administrativo',
      componenteId: 'ADMFM001',
      componenteNome: 'Manutenção de usuário',
      descontinuado: false,
    });

    return [access];
  }

  findOneTerminal(): UsuarioTerminalEntity {
    const terminal = new UsuarioTerminalEntity({
      usuarioId: 1,
      empresaId: 1,
      terminalId: 1,
    });
    return terminal;
  }

  findOneTerminalView(): UsuarioTerminalView {
    return new UsuarioTerminalView({
      usuarioId: 1,
      empresaId: 1,
      id: 1,
      inativo: false,
    });
  }
}

const userFakeRepository = new UserFakeRepository();
export { userFakeRepository };
