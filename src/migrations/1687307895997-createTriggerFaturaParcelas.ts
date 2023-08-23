import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerFaturaParcelas1687307895997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_parcelas_before_update`);
    await queryRunner.query(`
CREATE TRIGGER faturas_parcelas_before_update
BEFORE UPDATE ON faturas_parcelas
FOR EACH ROW
BEGIN
    IF OLD.situacao='Encerrada' AND  NEW.situacao = 'Normal' OR OLD.situacao = 'Cancelada' AND  NEW.situacao = 'Normal' THEN
		  -- Lançar uma exceção
		  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
	  ELSEIF NEW.situacao='Encerrada' AND NEW.caixaPagamento IS NOT NULL THEN
        SET NEW.valorPago = NEW.valor - NEW.valorDesconto;
        SET NEW.pagamento = now();
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_parcelas_after_update`);
    await queryRunner.query(`
CREATE TRIGGER faturas_parcelas_after_update
AFTER UPDATE ON faturas_parcelas
FOR EACH ROW
BEGIN
		SET @valorFatura = (select sum(valor) from faturas where empresaId=new.empresaId and id=new.faturaId);
		SET @valorParcelasPagas = (select sum(valor) from faturas_parcelas where empresaId=new.empresaId and faturaId=new.faturaId and situacao='Encerrada');

    IF @valorFatura = @valorParcelasPagas THEN
			update faturas set situacao='Encerrada' where empresaId=new.empresaId and id=new.faturaId;
		ELSEIF OLD.situacao='Encerrada' AND  NEW.situacao = 'Cancelada' THEN
			update faturas set situacao='Normal' where empresaId=new.empresaId and id=new.faturaId;
		END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_parcelas_after_update`);
  }
}
