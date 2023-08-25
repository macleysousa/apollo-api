import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewRomaneioItens1686353469463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_romaneios_itens AS
SELECT
ro.empresaId as empresaId,
ro.id as romaneioId,
ro.data as data,
ri.sequencia as sequencia,
r.id as referenciaId,
r.idExterno as referenciaIdExterno,
r.nome as referenciaNome,
p.id as produtoId,
p.idExterno as produtoIdExterno,
c.id as corId,
c.nome as corNome,
t.id as tamanhoId,
t.nome as tamanhoNome,
ro.modalidade as modalidade,
ro.operacao as operacao,
ro.situacao as situacao,
ri.emPromocao as emPromocao,
ri.quantidade as quantidade,
ri.valorUnitario as valorUnitario,
ri.valorUnitDesconto as valorUnitDesconto,
(ri.quantidade * ri.valorUnitario) as valorTotalBruto,
(ri.quantidade * ri.valorUnitDesconto) as valorTotalDesconto,
(ri.quantidade * ri.valorUnitario) - (ri.quantidade * ri.valorUnitDesconto) as valorTotalLiquido,
ri.cupomId as cupomId,
ri.operadorId as operadorId,
sum(ifnull(rid.quantidade,0)) as devolvido,
ri.romaneioOrigemId as romaneioOrigemId,
ri.romaneioOrigemSequencia as romaneioOrigemSequencia,
ri.criadoEm as criadoEm,
ri.atualizadoEm as atualizadoEm
FROM romaneios ro
inner join romaneios_itens ri on ri.romaneioId=ro.id
inner join referencias r on ri.referenciaId=r.id
inner join produtos p on ri.produtoId=p.id
left join romaneios_itens_devolvidos rid on rid.romaneioId=ro.id and rid.sequencia=ri.sequencia and rid.cancelado=0
left join cores c on p.corId=c.id
left join tamanhos t on p.tamanhoId=t.id
group by
ri.empresaId,
ri.romaneioId,
ri.sequencia,
ri.produtoId
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_romaneios_itens`);
  }
}
