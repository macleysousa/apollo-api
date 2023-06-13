import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerAtualizarEstoqueKardex1686664551406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER atualiza_estoque_kardex`);

    await queryRunner.query(`
CREATE TRIGGER atualiza_estoque_kardex
BEFORE UPDATE ON romaneios
FOR EACH ROW
BEGIN
    IF OLD.situacao = 'Cancelado' THEN
        -- Lançar uma exceção
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
    ELSEIF OLD.situacao <> 'Encerrado' AND NEW.situacao = 'Encerrado' THEN
        REPLACE INTO estoque_kardex (empresaId, data, romaneioId, referenciaId, produtoId, quantidade)
        SELECT empresaId, data, romaneioId, referenciaId, produtoId, IF(modalidade = 'Entrada', quantidade, quantidade * -1) AS quantidade
        FROM view_romaneios_itens
        WHERE romaneioId = NEW.id;
    ELSEIF OLD.situacao = 'Encerrado' AND NEW.situacao = 'Cancelado' THEN
        UPDATE estoque_kardex  SET cancelado = 1, atualizadoEm = now() WHERE romaneioId = NEW.id;
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER atualiza_estoque_kardex`);
  }
}
