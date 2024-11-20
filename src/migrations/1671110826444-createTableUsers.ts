import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { encrypt } from 'src/commons/crypto';
import { UsuarioSituacao } from 'src/modules/usuario/enums/usuario-situacao.enum';
import { Role } from 'src/modules/usuario/enums/usuario-tipo.enum';

export class createTableUsers1671110826444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'usuario',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'senha',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tipo',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'situacao',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.query(
      `INSERT INTO usuarios(usuario,nome,senha,tipo,situacao)
            VALUES ('apollo','developer','${encrypt('start')}','${Role.sysadmin}','${UsuarioSituacao.ativo}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios');
  }
}
