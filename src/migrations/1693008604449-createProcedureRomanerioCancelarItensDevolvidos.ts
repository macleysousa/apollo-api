import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProcedureRomanerioCancelarItensDevolvidos1693008604449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS romaneio_cancelar_itens_devolvidos`);
    await queryRunner.query(`
CREATE PROCEDURE romaneio_cancelar_itens_devolvidos(IN romaneioId INT)
BEGIN
    UPDATE romaneios_itens_devolvidos SET cancelado=1,atualizadoEm=now() WHERE romaneioId=romaneioId;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS romaneio_cancelar_itens_devolvidos`);
  }
}
