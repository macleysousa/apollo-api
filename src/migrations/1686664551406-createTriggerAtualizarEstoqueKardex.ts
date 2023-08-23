import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerAtualizarEstoqueKardex1686664551406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS romaneios_before_update`);

    await queryRunner.query(`
CREATE TRIGGER romaneios_before_update
BEFORE UPDATE ON romaneios
FOR EACH ROW
BEGIN
    IF OLD.situacao = 'Cancelado' THEN
        -- Lançar uma exceção
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Essa operação não é permitida';
    ELSEIF OLD.situacao <> 'Encerrado' AND NEW.situacao = 'Encerrado' THEN
        REPLACE INTO estoque_kardex (empresaId, data, romaneioId, referenciaId, produtoId, quantidade)
        SELECT empresaId, data, romaneioId, referenciaId, produtoId,SUM(IF(modalidade = 'Entrada', quantidade, quantidade * -1)) AS quantidade
        FROM view_romaneios_itens
        WHERE romaneioId = NEW.id
		    GROUP BY empresaId, data, romaneioId, referenciaId, produtoId;
    ELSEIF OLD.situacao = 'Encerrado' AND NEW.situacao = 'Cancelado' THEN
        UPDATE estoque_kardex  SET cancelado=1,atualizadoEm=now() WHERE romaneioId=NEW.id;
        UPDATE faturas SET situacao='Cancelada',operadorId=new.operadorId,motivoCancelamento=new.motivoCancelamento,atualizadoEm=now() WHERE romaneioId=NEW.id;
        UPDATE pessoas_extrato SET cancelado=1,operadorId=new.operadorId,motivoCancelamento=new.motivoCancelamento,atualizadoEm=now() WHERE romaneioId=NEW.id;
        UPDATE caixas_extrato SET cancelado=1,operadorId=new.operadorId,motivoCancelamento=new.motivoCancelamento,atualizadoEm=now() WHERE liquidacao=NEW.liquidacao;
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS romaneios_before_update`);
  }
}
