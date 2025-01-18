import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTableReferenciasMedias1737225143006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'referencias_medias',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'referenciaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isDefault',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isPublic',
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
        indices: [
          new TableIndex({
            isUnique: true,
            columnNames: ['id'],
          }),
          new TableIndex({
            isUnique: false,
            columnNames: ['referenciaId'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_dd8b37f0093c43d583281c9eba8',
            columnNames: ['referenciaId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'referencias',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('referencias_medias');
  }
}
