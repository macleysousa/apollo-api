import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFormasDePagamento1685550114851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'formas_de_pagamento',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'inicio',
            type: 'int',
            default: 0,
          },
          {
            name: 'parcelas',
            type: 'int',
            default: 1,
          },
          {
            name: 'tipo',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'inativa',
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

    await queryRunner.query(`
      INSERT INTO formas_de_pagamento (descricao, inicio, parcelas, tipo, inativa)
      VALUES
        ('Adiantamento', 0, 1, 'Adiantamento', false),
        ('Crédito de devolução', 0, 1, 'Crédito de devolução', false),
        ('Dinheiro', 0, 1, 'Dinheiro', false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('formas_de_pagamento');
  }
}
