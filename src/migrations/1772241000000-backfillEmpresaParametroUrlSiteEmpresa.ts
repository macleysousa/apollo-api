import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillEmpresaParametroUrlSiteEmpresa1772241000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO empresas_parametros (empresaId, parametroId, valor)
            SELECT e.id, 'URL_SITE_EMPRESA', ''
            FROM empresas e
            LEFT JOIN empresas_parametros ep
                ON ep.empresaId = e.id
                AND ep.parametroId = 'URL_SITE_EMPRESA'
            WHERE ep.empresaId IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM empresas_parametros
            WHERE parametroId = 'URL_SITE_EMPRESA'
        `);
  }
}
