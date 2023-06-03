import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewEstoqueProdutos1685751634240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_estoque_produtos AS
select
e.id as empresaId,
r.id as referenciaId,
r.idExterno as referenciaIdExterno,
p.id as produtoId,
p.idExterno as produtoIdExterno,
r.nome as nome,
c.id as corId,
c.nome as corNome,
t.id as tamanhoId,
t.nome as tamanhoNome,
r.unidadeMedida,
ifnull(est.saldo,0) as saldo,
est.atualizadoEm
 from produtos p
join empresas e
join referencias r on r.id = p.referenciaId
left join cores c on c.id = p.corId
left join tamanhos t on t.id = p.tamanhoId
left join estoque est on est.produtoId = p.id and est.empresaId=e.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_estoque_produtos`);
  }
}
