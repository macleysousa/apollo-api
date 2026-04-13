import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTableCaixasContagem1775916162976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixas_contagem',
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
            isPrimary: true,
          },
          {
            name: 'data',
            type: 'date',
            isPrimary: true,
          },
          {
            name: 'caixaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'operadorId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'observacao',
            type: 'varchar',
            length: '500',
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
        uniques: [
          {
            name: 'UQ_caixas_contagem_unica_caixa',
            columnNames: ['empresaId', 'caixaId'],
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
            columnNames: ['caixaId'],
            referencedTableName: 'caixas',
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
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'caixas_contagem_item',
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
            isPrimary: true,
          },
          {
            name: 'data',
            type: 'date',
            isPrimary: true,
          },
          {
            name: 'caixaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'contagemId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'tipoDocumento',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'quantidade',
            type: 'int',
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
        uniques: [
          {
            name: 'UQ_caixas_contagem_item_unico',
            columnNames: ['empresaId', 'caixaId', 'contagemId', 'tipoDocumento'],
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
            columnNames: ['caixaId'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['contagemId'],
            referencedTableName: 'caixas_contagem',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('caixas_contagem_item', 'UQ_caixas_contagem_item_unico');
    await queryRunner.dropIndex('caixas_contagem', 'UQ_caixas_contagem_unica_caixa');

    await queryRunner.dropTable('caixas_contagem_item');
    await queryRunner.dropTable('caixas_contagem');
  }
}
