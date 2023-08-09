import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class createTableProductsBarcodes1674744452844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produtos_codigos_barras',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'tipo',
            type: 'varchar',
            default: '"EAN13"',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'produtoId',
            type: 'bigint',
          },
        ],
        uniques: [
          new TableUnique({
            columnNames: ['codigo', 'produtoId'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['produtoId'],
            referencedTableName: 'produtos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('produtos_codigos_barras');
  }
}
