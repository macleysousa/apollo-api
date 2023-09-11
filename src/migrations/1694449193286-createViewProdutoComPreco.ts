import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewProdutoComPreco1694449193286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_produtos_com_preco AS
  select
  p.id as produtoId,
  p.idExterno as produtoIdExterno,
  r.id as referenciaId,
  r.idExterno as referenciaIdExterno,
  r.nome as nome,
  c.id as corId,
  c.nome as corNome,
  t.id as tamanhoId,
  t.nome as tamanhoNome,
  r.unidadeMedida as unidadeMedida,
  tp.id as tabelaDePrecoId,
  ifnull(pr.valor,0) as valor
  from produtos p
  join tabelas_de_precos tp
  inner join referencias r on r.id = p.referenciaId
  left join tabelas_de_precos_referencias pr on pr.tabelaDePrecoId = tp.id and pr.referenciaId = r.id
  left join cores c on c.id = p.corId
  left join tamanhos t on t.id = p.tamanhoId
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_produtos_com_preco`);
  }
}
