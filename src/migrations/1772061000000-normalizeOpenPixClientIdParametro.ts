import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeOpenPixClientIdParametro1772061000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure canonical parameter exists in parametros.
        await queryRunner.query(`
      INSERT INTO parametros (id, descricao, valorPadrao, depreciado)
      SELECT 'INTEGRACAO_OPEN_PIX_APP_ID', 'Client ID para integração com OpenPix', '', false
      WHERE NOT EXISTS (
        SELECT 1 FROM parametros WHERE id = 'INTEGRACAO_OPEN_PIX_APP_ID'
      )
    `);

        // If there is legacy CLIENT_ID in empresa params, migrate values to APP_ID when missing.
        await queryRunner.query(`
      INSERT INTO empresas_parametros (empresaId, parametroId, valor, criadoEm, atualizadoEm)
      SELECT ep.empresaId, 'INTEGRACAO_OPEN_PIX_APP_ID', ep.valor, ep.criadoEm, ep.atualizadoEm
      FROM empresas_parametros ep
      LEFT JOIN empresas_parametros app
        ON app.empresaId = ep.empresaId
        AND app.parametroId = 'INTEGRACAO_OPEN_PIX_APP_ID'
      WHERE ep.parametroId = 'INTEGRACAO_OPEN_PIX_CLIENT_ID'
        AND app.empresaId IS NULL
    `);

        // If both exist for the same company, keep APP_ID but fill empty APP_ID from CLIENT_ID.
        await queryRunner.query(`
      UPDATE empresas_parametros app
      JOIN empresas_parametros legacy
        ON legacy.empresaId = app.empresaId
        AND legacy.parametroId = 'INTEGRACAO_OPEN_PIX_CLIENT_ID'
      SET app.valor = legacy.valor
      WHERE app.parametroId = 'INTEGRACAO_OPEN_PIX_APP_ID'
        AND (app.valor IS NULL OR app.valor = '')
        AND (legacy.valor IS NOT NULL AND legacy.valor <> '')
    `);

        // Remove legacy company parameter entries.
        await queryRunner.query(`
      DELETE FROM empresas_parametros
      WHERE parametroId = 'INTEGRACAO_OPEN_PIX_CLIENT_ID'
    `);

        // Remove legacy base parameter entry.
        await queryRunner.query(`
      DELETE FROM parametros
      WHERE id = 'INTEGRACAO_OPEN_PIX_CLIENT_ID'
    `);

        // Remove accidental duplicate canonical rows if database drift dropped PK at some point.
        await queryRunner.query(`
      DELETE p1 FROM parametros p1
      INNER JOIN parametros p2
        ON p1.id = p2.id
      WHERE p1.id = 'INTEGRACAO_OPEN_PIX_APP_ID'
        AND p1.criadoEm > p2.criadoEm
    `).catch(() => {
            // Ignore on environments where parametros table has no criadoEm column.
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate legacy key only if needed by rollback consumers.
        await queryRunner.query(`
      INSERT INTO parametros (id, descricao, valorPadrao, depreciado)
      SELECT 'INTEGRACAO_OPEN_PIX_CLIENT_ID', 'Client ID para integração com OpenPix', '', false
      WHERE NOT EXISTS (
        SELECT 1 FROM parametros WHERE id = 'INTEGRACAO_OPEN_PIX_CLIENT_ID'
      )
    `);
    }
}
