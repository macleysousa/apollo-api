import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewUsuariosTerminais1744753553277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_usuarios_terminais AS
    SELECT
        ut.empresaId AS empresaId,
        ut.usuarioId AS usuarioId,
        et.id AS id,
        et.nome AS nome,
        et.inativo AS inativo,
        et.criadoEm AS criadoEm,
        et.atualizadoEm AS atualizadoEm
    FROM
        usuarios_terminais ut
        JOIN empresas_terminais et
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS view_usuarios_terminais`);
  }
}
