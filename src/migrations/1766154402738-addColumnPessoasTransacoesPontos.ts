import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnPessoasTransacoesPontos1766154402738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pessoas_transacoes_pontos',
      new TableColumn({
        name: 'transacaoId',
        type: 'int',
        isNullable: false,
        default: 0,
      }),
    );

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
        ptp.transacaoId AS transacaoId,
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

    await queryRunner.dropColumn('pessoas_transacoes_pontos', 'transacaoId');
  }
}
