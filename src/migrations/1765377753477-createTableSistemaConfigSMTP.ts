import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableSistemaConfigSMTP1765377753477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sistema_config_smtp',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'servidor',
            type: 'varchar',
          },
          {
            name: 'porta',
            type: 'int',
          },
          {
            name: 'usuario',
            type: 'varchar',
          },
          {
            name: 'senha',
            type: 'varchar',
          },
          {
            name: 'redefinirSenhaTemplate',
            type: 'json',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sistema_config_smtp');
  }
}
