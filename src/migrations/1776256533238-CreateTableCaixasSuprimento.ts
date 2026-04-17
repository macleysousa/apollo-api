import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableCaixasSuprimento1776256533238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixas_suprimento',
        columns: [
          {
            name: 'id',
            type: 'bigint',
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
            name: 'data',
            type: 'date',
            isPrimary: true,
          },
          {
            name: 'caixaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'origem',
            type: 'varchar',
            length: '45',
            default: "'externa'",
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'liquidacao',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'operadorId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'cancelado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'operadorCancelamentoId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'canceladoEm',
            type: 'timestamp',
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
        indices: [{ columnNames: ['empresaId', 'caixaId'] }, { columnNames: ['liquidacao'] }],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['caixaId'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['operadorCancelamentoId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caixas_suprimento');
  }
}
