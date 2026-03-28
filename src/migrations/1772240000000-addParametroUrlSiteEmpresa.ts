import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParametroUrlSiteEmpresa1772240000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO parametros (id, descricao, valorPadrao, depreciado)
            SELECT 'URL_SITE_EMPRESA', 'URL do site da empresa', '', false
            WHERE NOT EXISTS (
                SELECT 1 FROM parametros WHERE id = 'URL_SITE_EMPRESA'
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM empresas_parametros
            WHERE parametroId = 'URL_SITE_EMPRESA'
        `);

    await queryRunner.query(`
            DELETE FROM parametros
            WHERE id = 'URL_SITE_EMPRESA'
        `);
  }
}
