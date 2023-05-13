import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class createTableUserGroupAccesses1672148663309 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuarios_grupos',
        columns: [
          {
            name: 'usuarioId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'empresaId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'grupoId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'operadorId',
            type: 'int',
            isNullable: false,
            comment: 'usuário que realizou a ação',
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
        uniques: [new TableUnique({ columnNames: ['usuarioId', 'empresaId', 'grupoId'], name: 'unique_user_group_access' })],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['usuarioId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuarios',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['empresaId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'empresas',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['grupoId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'componentes_grupos',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['operadorId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuarios',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios_grupos');
  }
}
