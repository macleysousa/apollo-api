import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewEmpresasParametros1685734047762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW view_empresas_parametros AS
      SELECT e.id AS empresaId,p.id AS parametroId,p.descricao,ifnull(ep.valor,p.valorPadrao) as valor,p.depreciado FROM empresas e
      JOIN parametros p
      LEFT JOIN empresas_parametros ep on ep.parametroId =p.id and e.id = ep.empresaId
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW view_empresas_parametros');
  }
}
