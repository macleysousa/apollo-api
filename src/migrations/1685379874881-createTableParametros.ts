import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableParametros1685379874881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parametros',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
          },
          {
            name: 'valorPadrao',
            type: 'varchar',
          },
          {
            name: 'depreciado',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parametros');
  }
}
