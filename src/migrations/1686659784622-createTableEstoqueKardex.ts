import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableEstoqueKardex1686659784622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: `estoque_kardex`,
        columns: [
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
            name: 'romaneioId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: `referenciaId`,
            type: `int`,
            isPrimary: true,
          },
          {
            name: `produtoId`,
            type: `bigint`,
            isPrimary: true,
          },
          {
            name: 'quantidade',
            type: 'decimal(10,4)',
            isNullable: false,
          },
          {
            name: 'cancelado',
            type: 'boolean',
            default: false,
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
            columnNames: ['romaneioId'],
            referencedTableName: 'romaneios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['referenciaId'],
            referencedTableName: 'referencias',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: [`referenciaId`, `produtoId`],
            referencedTableName: `produtos`,
            referencedColumnNames: [`referenciaId`, `id`],
            onDelete: `RESTRICT`,
            onUpdate: `CASCADE`,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`estoque_kardex`);
  }
}
