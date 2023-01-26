import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableProducts1674743625382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'externalId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'unitMeasureId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'colorId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'sizeId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'categoryId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'subCaregoryId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'referenceId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'brandId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['unitMeasureId'],
            referencedTableName: 'measurement_units',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['colorId'],
            referencedTableName: 'colors',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['sizeId'],
            referencedTableName: 'sizes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['categoryId'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['subCaregoryId'],
            referencedTableName: 'categories_subs',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['referenceId'],
            referencedTableName: 'references',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['brandId'],
            referencedTableName: 'brands',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
