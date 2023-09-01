import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewConsignacaoItens1693587133284 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_consignacoes_itens AS
  select
  i.empresaId,
  i.consignacaoId,
  c.pessoaId,
  i.romaneioId,
  i.sequencia,
  i.produtoId,
  i.solicitado,
  if(r.operacao='consignacao_saida', r.valorTotalLiquido, 0)as valorSolicitado,
  i.devolvido,
  if(r.operacao='consignacao_devolucao', r.valorTotalLiquido, 0) as valorDevolvido,
  i.acertado,
  if(r.operacao='consignacao_acerto', r.valorTotalLiquido, 0) as valorAcertado,
  (i.solicitado - i.devolvido - i.acertado) as pendente,
  (if(r.operacao='consignacao_saida', r.valorTotalLiquido, 0) - if(r.operacao='consignacao_devolucao', r.valorTotalLiquido, 0) - if(r.operacao='consignacao_acerto', r.valorTotalLiquido, 0)) as valorPendente,
  i.operadorId,
  i.criadoEm,
  i.atualizadoEm
  from consignacoes_itens i
  inner join consignacoes c
  inner join view_romaneios_itens r on r.romaneioId=i.romaneioId and r.sequencia=i.sequencia and r.produtoId=i.produtoId
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_consignacao_itens`);
  }
}
