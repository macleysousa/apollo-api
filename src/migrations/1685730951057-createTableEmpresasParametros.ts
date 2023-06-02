import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableEmpresasParametros1685730951057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'empresas_parametros',
        columns: [
          {
            name: 'empresaId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'parametroId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'valor',
            type: 'varchar',
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
          {
            columnNames: ['empresaId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'empresas',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['parametroId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'parametros',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('empresas_parametros');
  }
}
