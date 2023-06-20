import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableEstoque1685748456499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'estoque',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'referenciaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'produtoId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'saldo',
            type: 'decimal',
            precision: 10,
            scale: 4,
            default: 0,
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
            columnNames: ['referenciaId'],
            referencedTableName: 'referencias',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['produtoId'],
            referencedTableName: 'produtos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('estoque');
  }
}
