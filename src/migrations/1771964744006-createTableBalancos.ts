import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableBalancos1771964744006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'balancos',
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
            isNullable: false,
          },
          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'observacao',
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
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            columnNames: ['empresaId'],
          },
          {
            columnNames: ['data'],
          },
          {
            columnNames: ['situacao'],
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'balancos_itens',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'balancoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'sequencia',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'produtoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'quantidadeContada',
            type: 'decimal(10,4)',
            default: 0,
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
        uniques: [{ columnNames: ['empresaId', 'balancoId', 'produtoId'] }],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['empresaId', 'balancoId'],
            referencedTableName: 'balancos',
            referencedColumnNames: ['empresaId', 'id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['produtoId'],
            referencedTableName: 'produtos',
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
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'balancos_lotes',
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
            isNullable: false,
          },
          {
            name: 'balancoId',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'lote',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'observacao',
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
            columnNames: ['empresaId', 'balancoId'],
            referencedTableName: 'balancos',
            referencedColumnNames: ['empresaId', 'id'],
            onDelete: 'CASCADE',
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
            columnNames: ['empresaId', 'balancoId'],
          },
          {
            columnNames: ['situacao'],
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'balancos_lotes_itens',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'balancoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'loteId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'sequencia',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'produtoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'quantidadeContada',
            type: 'decimal(10,4)',
            default: 0,
          },
          {
            name: 'quantidadeOriginal',
            type: 'decimal(10,4)',
            default: 0,
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
        uniques: [{ columnNames: ['empresaId', 'balancoId', 'loteId', 'produtoId'] }],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['empresaId', 'balancoId'],
            referencedTableName: 'balancos',
            referencedColumnNames: ['empresaId', 'id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['loteId'],
            referencedTableName: 'balancos_lotes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['produtoId'],
            referencedTableName: 'produtos',
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
            columnNames: ['empresaId', 'balancoId', 'loteId'],
          },
          {
            columnNames: ['produtoId'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('balancos_lotes_itens');
    await queryRunner.dropTable('balancos_lotes');
    await queryRunner.dropTable('balancos_itens');
    await queryRunner.dropTable('balancos');
  }
}
