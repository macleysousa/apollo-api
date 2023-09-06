import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTablePedidosItens1694009802971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: `pedidos_itens`,
        columns: [
          {
            name: `empresaId`,
            type: `int`,
            isPrimary: true,
          },
          {
            name: `pedidoId`,
            type: `bigint`,
            isPrimary: true,
          },
          {
            name: `produtoId`,
            type: `bigint`,
            isPrimary: true,
          },
          {
            name: `sequencia`,
            type: `int`,
            isPrimary: true,
          },
          {
            name: `solicitado`,
            type: `decimal(10,4)`,
            default: 1,
          },
          {
            name: `atendido`,
            type: `decimal(10,4)`,
            default: 0,
          },
          {
            name: `valorUnitario`,
            type: `decimal(10,4)`,
            default: 0,
          },
          {
            name: `valorUnitDesconto`,
            type: `decimal(10,4)`,
            default: 0,
          },
          {
            name: `operadorId`,
            type: `int`,
            isNullable: false,
          },
          {
            name: `criadoEm`,
            type: `timestamp`,
            default: `now()`,
          },
          {
            name: `atualizadoEm`,
            type: `timestamp`,
            default: `now()`,
          },
        ],
        uniques: [{ columnNames: ['pedidoId', 'produtoId', 'sequencia'] }],
        foreignKeys: [
          {
            columnNames: [`empresaId`],
            referencedTableName: `empresas`,
            referencedColumnNames: [`id`],
            onDelete: `CASCADE`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`pedidoId`],
            referencedTableName: `pedidos`,
            referencedColumnNames: [`id`],
            onDelete: `CASCADE`,
            onUpdate: `CASCADE`,
          },
          {
            columnNames: [`produtoId`],
            referencedTableName: `produtos`,
            referencedColumnNames: [`id`],
            onDelete: `CASCADE`,
            onUpdate: `RESTRICT`,
          },
          {
            columnNames: [`operadorId`],
            referencedTableName: `usuarios`,
            referencedColumnNames: [`id`],
            onDelete: `CASCADE`,
            onUpdate: `RESTRICT`,
          },
        ],
      })
    );

    await queryRunner.createIndices(`pedidos_itens`, [
      new TableIndex({ columnNames: [`pedidoId`] }),
      new TableIndex({ columnNames: [`produtoId`] }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`pedidos_itens`);
  }
}
