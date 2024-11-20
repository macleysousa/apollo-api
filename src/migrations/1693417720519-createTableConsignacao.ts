import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableConsignacao1693417720519 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consignacoes',
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
            name: 'caixaAbertura',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'dataAbertura',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'previsaoFechamento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'caixaFechamento',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'dataFechamento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'situacao',
            type: 'varchar',
            default: "'em_andamento'",
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observacao',
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
        indices: [{ columnNames: ['funcionarioId'] }, { columnNames: ['dataAbertura'] }, { columnNames: ['dataFechamento'] }],
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
            columnNames: ['caixaAbertura'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          {
            columnNames: ['caixaFechamento'],
            referencedTableName: 'caixas',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consignacoes');
  }
}
