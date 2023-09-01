import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableConsignacaoItens1693426713509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consignacoes_itens',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'consignacaoId',
            type: 'bigint',
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
            name: 'solicitado',
            type: 'decimal(18,4)',
            default: 1,
          },
          {
            name: 'devolvido',
            type: 'decimal(18,4)',
            default: 0,
          },
          {
            name: 'acertado',
            type: 'decimal(18,4)',
            default: 0,
          },
          {
            name: 'operadorId',
            type: 'int',
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
        uniques: [{ columnNames: ['romaneioId', 'sequencia', 'produtoId'] }],
        indices: [
          { columnNames: ['empresaId'] },
          { columnNames: ['consignacaoId'] },
          { columnNames: ['romaneioId'] },
          { columnNames: ['produtoId'] },
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
            columnNames: ['consignacaoId'],
            referencedTableName: 'consignacoes',
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
            columnNames: ['romaneioId', 'sequencia', 'produtoId'],
            referencedTableName: 'romaneios_itens',
            referencedColumnNames: ['romaneioId', 'sequencia', 'produtoId'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consignacoes_itens');
  }
}
