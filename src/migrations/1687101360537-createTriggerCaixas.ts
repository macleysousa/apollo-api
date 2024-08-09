import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerCaixas1687101360537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_before_insert`);
    await queryRunner.query(`
CREATE TRIGGER caixas_before_insert
BEFORE INSERT ON caixas
FOR EACH ROW
BEGIN
   IF NEW.situacao = 'fechado' THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
	ELSEIF NEW.situacao = 'abertura' THEN
		SET NEW.abertura = CURRENT_TIMESTAMP;
  ELSEIF NEW.operadorAberturaId is null THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida (operador de abertura não informado)';
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_after_insert`);
    await queryRunner.query(`
CREATE TRIGGER caixas_after_insert
AFTER INSERT ON caixas
FOR EACH ROW
BEGIN
    IF NEW.situacao = 'aberto' THEN
       INSERT INTO caixas_extrato(empresaId,data,caixaId,tipoDocumento,tipoHistorico,tipoMovimento,valor,operadorId)
							VALUE(NEW.empresaId,NEW.data,NEW.id,'Dinheiro','Abertura de Caixa','Crédito',NEW.valorAbertura,NEW.operadorAberturaId);
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_before_update`);
    await queryRunner.query(`
CREATE TRIGGER caixas_before_update
BEFORE UPDATE ON caixas
FOR EACH ROW
BEGIN
    IF NEW.situacao = 'fechado' THEN
       SET NEW.fechamento = CURRENT_TIMESTAMP;
	  ELSEIF NEW.situacao = 'fechado' AND NEW.operadorFechamentoId is null THEN
	   -- Lançar uma exceção
	   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida (operador de fechamento não informado)';
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_after_update`);
    await queryRunner.query(`
CREATE TRIGGER caixas_after_update
AFTER UPDATE ON caixas
FOR EACH ROW
BEGIN
    IF OLD.situacao='aberto' AND NEW.situacao = 'fechado' THEN
       INSERT INTO caixas_extrato(empresaId,data,caixaId,tipoDocumento,tipoHistorico,tipoMovimento,valor,operadorId)
							VALUE(NEW.empresaId,NEW.data,NEW.id,'Dinheiro','Fechamento de Caixa','Débito',NEW.valorFechamento,NEW.operadorFechamentoId);
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_before_insert`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_after_insert`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_before_update`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_after_update`);
  }
}
