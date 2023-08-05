import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerCaixaExtrato1687391921039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_insert`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_before_insert
BEFORE INSERT ON caixas_extrato
FOR EACH ROW
BEGIN
      IF NEW.tipoMovimento = 'Troco' THEN
        SET NEW.tipoMovimento = 'Débito';
      END IF;

      IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
          SET NEW.valor = -NEW.valor;
      ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
          SET NEW.valor = ABS(NEW.valor);
      END IF;

      IF NEW.faturaId IS NOT NULL AND NEW.faturaParcela IS NOT NULL AND NEW.cancelado = 0 THEN
      UPDATE faturas_parcelas SET situacao='Paga',
                                  caixaPagamento = NEW.caixaId,
                                  operadorId = NEW.operadorId
                                  WHERE faturaId = NEW.faturaId AND parcela = NEW.faturaParcela;
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_afert_insert`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_afert_insert
AFTER INSERT ON caixas_extrato
FOR EACH ROW
BEGIN
		IF NEW.tipoHistorico='Adiantamento' OR NEW.tipoDocumento='Adiantamento' THEN
			SET @pessoaId=(SELECT pessoaId FROM faturas WHERE id=NEW.faturaId);
			INSERT INTO pessoas_extrato (empresaId,data,liquidacao,pessoaId,faturaId,faturaParcela,
										 tipoDocumento,valor,tipoMovimento,observacao,operadorId)
			VALUES(NEW.empresaId,NEW.data,NEW.liquidacao,@pessoaId,NEW.faturaId,NEW.faturaParcela,
				   'Adiantamento',NEW.valor,NEW.tipoMovimento,NEW.observacao,NEW.operadorId);
		END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_update`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_before_update
BEFORE UPDATE ON caixas_extrato
FOR EACH ROW
BEGIN
      IF NEW.tipoMovimento = 'Troco' THEN
        SET NEW.tipoMovimento = 'Débito';
      END IF;

      IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
          SET NEW.valor = -NEW.valor;
      ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
          SET NEW.valor = ABS(NEW.valor);
      END IF;

      IF NEW.faturaId IS NOT NULL AND NEW.faturaParcela IS NOT NULL AND NEW.cancelado = 0 THEN
      UPDATE faturas_parcelas SET situacao='Paga',
                                  caixaPagamento = NEW.caixaId,
                                  operadorId = NEW.operadorId
                                  WHERE faturaId = NEW.faturaId AND parcela = NEW.faturaParcela;
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_after_update`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_after_update
AFTER UPDATE ON caixas_extrato
FOR EACH ROW
BEGIN
    IF OLD.cancelado=FALSE AND NEW.cancelado=TRUE THEN
      UPDATE pessoas_extrato SET cancelado=TRUE,
                                 motivoCancelamento=NEW.motivoCancelamento,
                                 operadorId=NEW.operadorId,
                                 atualizadoEm=now()
      WHERE empresaId=NEW.empresaId AND liquidacao=NEW.liquidacao;
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_insert`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_afert_insert`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_update`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_after_update`);
  }
}
