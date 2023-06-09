import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewPrecosReferencias1685974701712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW view_precos_referencias AS
SELECT
p.id as tabelaDePrecoId,
r.id as referenciaId,
r.idExterno as referenciaIdExterno,
r.nome as referenciaNome,
ifnull(pr.preco,0) as preco,
pr.operadorId,
pr.criadoEm,
pr.atualizadoEm
FROM tabelas_de_precos p
inner join referencias r
left join tabelas_de_precos_referencias pr on pr.referenciaId=r.id and pr.tabelaDePrecoId=p.id
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW view_precos_referencias`);
  }
}
