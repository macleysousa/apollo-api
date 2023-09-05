import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTablePedidos1693931414147 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
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
            name: 'pessoaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'funcionarioId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tabelaPrecoId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'dataBasePagamento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'parcelas',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'intervalo',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'previsaoDeFaturamento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'previsaoDeEntrega',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'tipo',
            type: 'varchar',
            default: '"transferencia"',
          },
          {
            name: 'kardex',
            type: 'boolean',
            default: true,
          },
          {
            name: 'financeiro',
            type: 'boolean',
            default: false,
          },
          {
            name: 'fiscal',
            type: 'boolean',
            default: false,
          },
          {
            name: 'observacao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'situacao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'romaneioOrigemId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'romaneioDestinoId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'pedidoExternoId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'operadorId',
            type: 'int',
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
        uniques: [{ columnNames: ['id'] }],
        indices: [{ columnNames: ['tipo'] }, { columnNames: ['romaneioOrigemId'] }, { columnNames: ['pedidoExternoId'] }],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['pessoaId'],
            referencedTableName: 'pessoas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['funcionarioId'],
            referencedTableName: 'funcionarios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['tabelaPrecoId'],
            referencedTableName: 'tabelas_de_precos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['romaneioOrigemId'],
            referencedTableName: 'romaneios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['romaneioDestinoId'],
            referencedTableName: 'romaneios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedidos');
  }
}
