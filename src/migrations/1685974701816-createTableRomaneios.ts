import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRomaneios1685974701816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'romaneios',
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
            isPrimary: false,
          },
          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'pessoaId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'funcionarioId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tabelaPrecoId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'pago',
            type: 'boolean',
            default: false,
          },
          {
            name: 'caixaId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'liquidacao',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'kardex',
            type: 'boolean',
            default: true,
          },
          {
            name: 'financeiro',
            type: 'boolean',
            default: true,
          },
          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'modalidade',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'operacao',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'romaneiosDevolucao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'situacao',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'operadorId',
            type: 'int',
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
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['funcionarioId'],
            referencedTableName: 'funcionarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['tabelaPrecoId'],
            referencedTableName: 'tabelas_de_precos',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['caixaId'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            columnNames: ['data'],
          },

          {
            columnNames: ['situacao'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('romaneios');
  }
}
