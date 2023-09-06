import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTabelasDePrecosReferencias1685974700801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tabelas_de_precos_referencias',
        columns: [
          {
            name: 'tabelaDePrecoId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'referenciaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'valor',
            type: 'decimal(10,4)',
            isNullable: false,
          },
          {
            name: 'operadorId',
            type: 'int',
            isNullable: false,
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
            columnNames: ['tabelaDePrecoId'],
            referencedTableName: 'tabelas_de_precos',
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
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tabelas_de_precos_referencias');
  }
}
