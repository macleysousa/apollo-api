import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProcedureRomanerioCalcularItensDevolvidos1693005606797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP procedure IF EXISTS romaneio_calcular_itens_devidos`);

    await queryRunner.query(`
CREATE PROCEDURE romaneio_calcular_itens_devidos (in romaneioId bigint)
BEGIN
INSERT INTO romaneios_itens_devolvidos (empresaId, romaneioId, sequencia, produtoId, quantidade,
                                        romaneioDevolucaoId, romaneioDevolucaoSequencia, operadorId)
                                  SELECT i.empresaId, i.romaneioOrigemId, i.romaneioOrigemSequencia,
                                         i.produtoId, i.quantidade, i.romaneioId, i.sequencia, i.operadorId
                                  FROM romaneios_itens i WHERE i.romaneioId = romaneioId AND i.romaneioOrigemId IS NOT NULL
ON DUPLICATE KEY UPDATE quantidade = i.quantidade;
END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP procedure IF EXISTS romaneio_calcular_itens_devidos`);
  }
}
