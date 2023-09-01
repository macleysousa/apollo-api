import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewConsignacao1693587451996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_consignacoes AS
  select
  c.empresaId,
  c.id,
  c.pessoaId,
  p.nome as nomePessoa,
  c.tabelaPrecoId,
  c.caixaAbertura,
  c.dataAbertura,
  c.previsaoFechamento,
  c.caixaFechamento,
  c.dataFechamento,
  c.funcionarioId,
  f.nome as nomeFuncionario,
  c.observacao,
  c.situacao,
  c.motivoCancelamento,
  sum(ifnull(i.solicitado,0)) as solicitado,
  sum(ifnull(i.valorSolicitado,0)) as valorSolicitado,
  sum(ifnull(i.devolvido,0)) as devolvido,
  sum(ifnull(i.valorDevolvido,0)) as valorDevolvido,
  sum(ifnull(i.acertado,0)) as acertado,
  sum(ifnull(i.valorAcertado,0)) as valorAcertado,
  sum(ifnull(i.pendente,0)) as pendente,
  sum(ifnull(i.valorPendente,0)) as valorPendente,
  c.operadorId,
  c.criadoEm,
  c.atualizadoEm
  from consignacoes c
  inner join pessoas p on p.id=c.pessoaId
  inner join funcionarios f on f.id=c.funcionarioId
  left join view_consignacoes_itens i on i.consignacaoId=c.id
  group by c.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_consignacoes`);
  }
}
