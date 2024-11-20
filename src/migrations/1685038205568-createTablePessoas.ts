import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTablePessoas1685038205568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tipo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'documento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'ufInscricaoEstadual',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'inscricaoEstadual',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'nascimento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tipoContato',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'contato',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'cliente',
            type: 'boolean',
            default: true,
          },
          {
            name: 'fornecedor',
            type: 'boolean',
            default: false,
          },
          {
            name: 'funcionario',
            type: 'boolean',
            default: false,
          },
          {
            name: 'bloqueado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'empresaCadastro',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'empresasAcesso',
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
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['empresaCadastro'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas');
  }
}
