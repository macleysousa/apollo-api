import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerFaturaParcelas1687307895997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_parcelas_before_update`);
    await queryRunner.query(`
CREATE TRIGGER faturas_parcelas_before_update
BEFORE UPDATE ON faturas_parcelas
FOR EACH ROW
BEGIN
    IF OLD.situacao = 'Paga' AND  NEW.situacao = 'Normal' OR OLD.situacao = 'Cancelada' AND  NEW.situacao = 'Normal' THEN
		-- Lançar uma exceção
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
	ELSEIF OLD.situacao = 'Paga' AND  NEW.situacao = 'Cancelada' THEN
		UPDATE caixas_extrato SET cancelado=true, motivoCancelamento=NEW.motivoCancelamento WHERE faturaId=NEW.faturaId AND parcela=NEW.parcela;
	ELSEIF NEW.situacao = 'Paga' AND NEW.caixaPagamento IS NOT NULL THEN
        SET NEW.valorPago = NEW.valor - NEW.valorDesconto;
        SET NEW.pagamento = now();
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_parcelas_before_update`);
  }
}
