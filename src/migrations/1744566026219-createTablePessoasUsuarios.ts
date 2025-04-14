import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateTablePessoasUsuarios1744566026219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoas_usuarios',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'pessoaId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'sobrenome',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'documento',
            type: 'varchar',
          },
          {
            name: 'dataNascimento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'imagemPerfil',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailVerificado',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'current_timestamp',
            onUpdate: 'current_timestamp',
          },
        ],
        uniques: [new TableUnique({ columnNames: ['email'] }), new TableUnique({ columnNames: ['documento'] })],
        foreignKeys: [
          {
            columnNames: ['pessoaId'],
            referencedTableName: 'pessoas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas_usuarios');
  }
}
