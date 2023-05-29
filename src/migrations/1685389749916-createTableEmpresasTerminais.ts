import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableEmpresasTerminais1685389749916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'empresas_terminais',
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
            isPrimary: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'inativo',
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('empresas_terminais');
  }
}
