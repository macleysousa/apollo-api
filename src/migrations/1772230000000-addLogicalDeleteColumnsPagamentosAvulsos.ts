import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogicalDeleteColumnsPagamentosAvulsos1772230000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE pagamentos_avulsos
                ADD COLUMN apagado tinyint(1) NOT NULL DEFAULT 0,
                ADD COLUMN apagadoEm datetime NULL
        `);

    await queryRunner.query(`
            CREATE INDEX IDX_pagamentos_avulsos_empresa_apagado
            ON pagamentos_avulsos (empresaId, apagado)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX IDX_pagamentos_avulsos_empresa_apagado ON pagamentos_avulsos
        `);

    await queryRunner.query(`
            ALTER TABLE pagamentos_avulsos
                DROP COLUMN apagadoEm,
                DROP COLUMN apagado
        `);
  }
}
