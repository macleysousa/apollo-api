import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerAtualizarEstoque1686675632695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS atualiza_estoque_insert`);

    await queryRunner.query(`
CREATE TRIGGER atualiza_estoque_insert
BEFORE INSERT ON estoque_kardex
FOR EACH ROW
BEGIN
    IF NEW.cancelado = 0 AND (SELECT IFNULL(SUM(saldo), 0) FROM estoque WHERE empresaId = NEW.empresaId AND produtoId = NEW.produtoId) + NEW.quantidade < 0 THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: O saldo insuficiente para a operação.';
	ELSEIF NEW.cancelado = 0 THEN
		INSERT INTO estoque (empresaId, referenciaId, produtoId, saldo, atualizadoEm)
		VALUES (NEW.empresaId, NEW.referenciaId, NEW.produtoId, NEW.quantidade, NOW())
		ON DUPLICATE KEY UPDATE saldo = saldo + NEW.quantidade, atualizadoEm = NOW();
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS atualiza_estoque_update`);

    await queryRunner.query(`
CREATE TRIGGER atualiza_estoque_update
BEFORE UPDATE ON estoque_kardex
FOR EACH ROW
BEGIN
    IF OLD.cancelado = 0 AND (SELECT IFNULL(SUM(saldo), 0) FROM estoque WHERE empresaId = NEW.empresaId AND produtoId = NEW.produtoId) - NEW.quantidade < 0 THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: O saldo insuficiente para a operação.';
	ELSEIF OLD.cancelado = 1 and NEW.cancelado = 0 THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
	ELSEIF OLD.cancelado = 0 and NEW.cancelado = 1 THEN
		INSERT INTO estoque (empresaId, referenciaId, produtoId, saldo, atualizadoEm)
		VALUES (NEW.empresaId, NEW.referenciaId, NEW.produtoId, NEW.quantidade, NOW())
		ON DUPLICATE KEY UPDATE saldo = saldo - NEW.quantidade, atualizadoEm = NOW();
    END IF;
END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS atualiza_estoque_insert`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS atualiza_estoque_update`);
  }
}
