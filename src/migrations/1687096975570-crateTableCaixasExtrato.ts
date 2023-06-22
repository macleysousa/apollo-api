import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CrateTableCaixasExtrato1687096975570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixas_extrato',
        columns: [
          {
            name: 'documento',
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
            name: 'liquidacao',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tipoDocumento',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'tipoHistorico',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'tipoMovimento',
            type: 'enum',
            enum: ['Débito', 'Crédito'],
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'faturaId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'faturaParcela',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'observacao',
            type: 'varchar',
            length: '500',
            isNullable: true,
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
            columnNames: ['faturaId'],
            referencedTableName: 'faturas',
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
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caixas_extrato');
  }
}
