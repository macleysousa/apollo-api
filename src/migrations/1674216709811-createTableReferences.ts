import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableReferences1674216709811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'referencias',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'idExterno',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'unidadeMedida',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'categoriaId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'subCategoriaId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'marcaId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'composicao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cuidados',
            type: 'text',
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
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['categoriaId'],
            referencedTableName: 'categorias',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['subCategoriaId'],
            referencedTableName: 'categorias_subs',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['marcaId'],
            referencedTableName: 'marcas',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('referencias');
  }
}
