import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEcommerces1774703378684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ecommerces',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'empresaId',
            type: 'int',
          },
          {
            name: 'titulo',
            type: 'varchar',
          },
          {
            name: 'subtitulo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'icone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ecommerces');
  }
}
