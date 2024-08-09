import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableCaixas1685389836832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixas',
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
            isPrimary: false,
          },
          {
            name: 'data',
            type: 'date',
            isPrimary: false,
          },
          {
            name: 'terminalId',
            type: 'int',
            isPrimary: false,
          },
          {
            name: 'abertura',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'valorAbertura',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'operadorAberturaId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fechamento',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'valorFechamento',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'operadorFechamentoId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'situacao',
            type: 'enum',
            enum: ['aberto', 'fechado'],
            default: "'aberto'",
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['terminalId'],
            referencedTableName: 'empresas_terminais',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['operadorAberturaId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['operadorFechamentoId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caixas');
  }
}
