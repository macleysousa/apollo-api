import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewRomaneios1686575262671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_romaneios AS
select
r.empresaId as empresaId,
r.id as romaneioId,
r.data as data,
p.id as pessoaId,
p.nome as pessoaNome,
f.id as funcionarioId,
f.nome as funcionarioNome,
r.tabelaPrecoId as tabelaPrecoId,
r.modalidade as modalidade,
r.operacao as operacao,
r.situacao as situacao,
r.pago as pago,
r.acertoConsignacao as acertoConsignacao,
r.caixaId as caixaId,
rf.tipo as tipoFrete,
ifnull(rf.valor,0) as valorFrete,
sum(ifnull(ri.quantidade,0)) as quantidade,
sum(ifnull(ri.valorUnitario * ri.quantidade,0)) as valorBruto,
sum(ifnull(ri.valorUnitDesconto * ri.quantidade,0)) as valorDesconto,
sum(ifnull((ri.valorUnitario * ri.quantidade)-(ri.valorUnitDesconto * ri.quantidade),0)) as valorLiquido,
r.operadorId as operadorId,
r.criadoEm as criadoEm,
r.atualizadoEm as atualizadoEm
from romaneios r
inner join pessoas p on p.id=r.pessoaId
inner join funcionarios f on f.id=r.funcionarioId
left join romaneios_fretes rf on rf.romaneioId=r.id
left join romaneios_itens ri on ri.romaneioId=r.id
group by r.id
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_romaneios`);
  }
}
