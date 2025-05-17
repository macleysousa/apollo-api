import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewPessoasTransacoesPontos1745675864818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_pessoas_transacoes_pontos AS
    SELECT
        ptp.id AS id,
        ptp.empresaId AS empresaId,
        ptp.pessoaId AS pessoaId,
        ptp.pessoaDocumento AS pessoaDocumento,
        ptp.data AS data,
        ptp.tipo AS tipo,
        ptp.quantidade AS quantidade,
        ptp.resgatado AS resgatado,
        (ptp.quantidade - ptp.resgatado) AS saldo,
        ptp.observacao AS observacao,
        ptp.validaAte AS validaAte,
        ptp.cancelada AS cancelada,
        ptp.motivoCancelamento AS motivoCancelamento,
        ptp.canceladaEm AS canceladaEm,
        IF( ptp.cancelada = FALSE AND (ptp.validaAte > NOW() OR ptp.validaAte IS NULL), TRUE, FALSE) AS valida,
        ptp.criadoEm AS criadoEm,
        ptp.atualizadoEm AS atualizadoEm
    FROM
        pessoas_transacoes_pontos ptp;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS view_pessoas_transacoes_pontos`);
  }
}
