import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableTabelasDePrecosTerminadorNullable1774275182000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tabelas_de_precos
      MODIFY COLUMN terminador decimal(3,2) NULL DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE tabelas_de_precos
      SET terminador = 0.9
      WHERE terminador IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE tabelas_de_precos
      MODIFY COLUMN terminador decimal(3,2) NOT NULL DEFAULT 0.9
    `);
  }
}
