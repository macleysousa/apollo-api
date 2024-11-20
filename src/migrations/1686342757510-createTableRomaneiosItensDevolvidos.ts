import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRomaneioItensDevolvidos1686342757510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'romaneios_itens_devolvidos',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'romaneioId',
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
            name: 'quantidade',
            type: 'decimal(10,4)',
            isNullable: false,
          },
          {
            name: 'romaneioDevolucaoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'romaneioDevolucaoSequencia',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'cancelado',
            type: 'boolean',
            default: false,
          },
          {
            name: `operadorId`,
            type: `int`,
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
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['romaneioId'],
            referencedTableName: 'romaneios',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['romaneioId', 'sequencia'],
            referencedTableName: 'romaneios_itens',
            referencedColumnNames: ['romaneioId', 'sequencia'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['produtoId'],
            referencedTableName: 'produtos',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['romaneioDevolucaoId'],
            referencedTableName: 'romaneios',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['romaneioDevolucaoId', 'romaneioDevolucaoSequencia'],
            referencedTableName: 'romaneios_itens',
            referencedColumnNames: ['romaneioId', 'sequencia'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
