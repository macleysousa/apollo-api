import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRomaneioItens1686318246326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: `romaneios_itens`,
        columns: [
          {
            name: `empresaId`,
            type: `int`,
            isPrimary: true,
          },
          {
            name: `romaneioId`,
            type: `bigint`,
            isPrimary: true,
          },
          {
            name: `data`,
            type: `date`,
            isPrimary: true,
          },
          {
            name: 'sequencia',
            type: 'int',
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
            name: `quantidade`,
            type: `decimal(10,4)`,
            isNullable: false,
          },
          {
            name: `valorUnitario`,
            type: `decimal(10,4)`,
            isNullable: false,
          },
          {
            name: `valorUnitDesconto`,
            type: `decimal(10,4)`,
            default: 0,
          },
          {
            name: `emPromocao`,
            type: `boolean`,
            default: false,
          },
          {
            name: `cupomId`,
            type: `int`,
            isNullable: true,
          },
          {
            name: `devolvido`,
            type: `decimal(10,4)`,
            default: false,
          },
          {
            name: `romaneioOrigemId`,
            type: `bigint`,
            isNullable: true,
          },
          {
            name: `romaneioOrigemSequencia`,
            type: `int`,
            isNullable: true,
          },
          {
            name: `operadorId`,
            type: `int`,
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
        uniques: [{ columnNames: [`romaneioId`, `sequencia`, `produtoId`] }],
        foreignKeys: [
          {
            columnNames: [`empresaId`],
            referencedTableName: `empresas`,
            referencedColumnNames: [`id`],
            onDelete: `CASCADE`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`empresaId`, `romaneioId`],
            referencedTableName: `romaneios`,
            referencedColumnNames: [`empresaId`, `id`],
            onDelete: `CASCADE`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`referenciaId`],
            referencedTableName: `referencias`,
            referencedColumnNames: [`id`],
            onDelete: `RESTRICT`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`referenciaId`, `produtoId`],
            referencedTableName: `produtos`,
            referencedColumnNames: [`referenciaId`, `id`],
            onDelete: `RESTRICT`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`empresaId`, `romaneioOrigemId`],
            referencedTableName: `romaneios`,
            referencedColumnNames: [`empresaId`, `id`],
            onDelete: `CASCADE`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`operadorId`],
            referencedTableName: `usuarios`,
            referencedColumnNames: [`id`],
            onDelete: `RESTRICT`,
            onUpdate: `CASCADE`,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`romaneios_itens`);
  }
}
