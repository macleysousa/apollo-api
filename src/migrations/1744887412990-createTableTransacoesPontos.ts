import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTransacoesPontos1744887412990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pontos');

    await queryRunner.createTable(
      new Table({
        name: 'pessoas_transacoes_pontos',
        columns: [
          {
            name: 'id',
            type: 'bigint',
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
            name: 'data',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'tipo',
            type: 'varchar',
          },
          {
            name: 'quantidade',
            type: 'decimal(10,2)',
          },
          {
            name: 'resgatado',
            type: 'decimal(10,2)',
            default: '0.00',
          },
          {
            name: 'observacao',
            type: 'varchar',
            isNullable: true,
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

    await queryRunner.query(`ALTER TABLE pessoas_transacoes_pontos AUTO_INCREMENT = 1000;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas_transacoes_pontos');

    await queryRunner.createTable(
      new Table({
        name: 'pontos',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'pessoaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'dataDeValidade',
            type: 'timestamp',
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
            onUpdate: 'RESTRICT',
          },
        ],
      }),
    );
  }
}
