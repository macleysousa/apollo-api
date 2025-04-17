import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTransacoesPontos1744887412990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoas_transacoes_pontos',
        columns: [
          {
            name: 'bigint',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'empresaId',
            type: 'int',
          },
          {
            name: 'pessoaId',
            type: 'int',
          },
          {
            name: 'pessoaDocumento',
            type: 'varchar',
          },
          {
            name: 'tipo',
            type: 'varchar',
          },
          {
            name: 'quantidade',
            type: 'decimal',
          },
          {
            name: 'resgatado',
            type: 'decimal',
          },
          {
            name: 'data',
            type: 'timestamp',
          },
          {
            name: 'observacao',
            type: 'varchar',
          },
          {
            name: 'validoAte',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'canceladoEm',
            type: 'timestamp',
            isNullable: true,
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
        indices: [{ columnNames: ['empresaId'] }, { columnNames: ['pessoaId'] }, { columnNames: ['pessoaDocumento'] }],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
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
    await queryRunner.dropTable('pessoas_transacoes_pontos');
  }
}
