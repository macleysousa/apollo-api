import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFunctionPessoaPontos1745677996712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE FUNCTION fn_pessoa_saldo_pontos(_pessoaId INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_saldo_total DECIMAL(10,2);

    SELECT COALESCE(SUM(saldo), 0) INTO v_saldo_total FROM view_pessoas_transacoes_pontos WHERE valida = true AND pessoaId = _pessoaId;

    RETURN v_saldo_total;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_pessoa_saldo_pontos`);
  }
}
