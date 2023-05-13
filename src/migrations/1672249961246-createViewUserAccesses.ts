import { MigrationInterface, QueryRunner } from 'typeorm';

export class createViewUserAccesses1672249961246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW usuarios_acessos AS
    select distinct
    u.id,
    ug.empresaId,
    ug.grupoId,
    cg.nome 'grupoNome',
    cgi.componenteId,
    c.nome 'componenteNome',
    c.descontinuado from usuarios as u
inner join usuarios_grupos ug on ug.usuarioId = u.id
inner join componentes_grupos cg on cg.id = ug.grupoId
inner join componentes_grupos_itens cgi on cgi.grupoId = ug.grupoId
inner join componentes c on c.id = cgi.componenteId
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW usuarios_acessos`);
  }
}
