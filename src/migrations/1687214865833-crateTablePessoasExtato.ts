import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CrateTablePessoasExtato1687214865833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoas_extrato',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'data',
            type: 'date',
            isPrimary: true,
          },
          {
            name: 'liquidacao',
            type: 'bigint',
            isPrimary: false,
          },
          {
            name: 'pessoaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'faturaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'faturaParcela',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'tipoDocumento',
            type: 'enum',
            enum: ['Adiantamento', 'Crédito de Devolução'],
          },
          {
            name: 'tipoMovimento',
            type: 'enum',
            enum: ['Crédito', 'Débito'],
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'observacao',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'cancelado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'motivoCancelamento',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'operadorId',
            type: 'int',
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['pessoaId'],
            referencedTableName: 'pessoas',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['empresaId', 'faturaId'],
            referencedTableName: 'faturas',
            referencedColumnNames: ['empresaId', 'id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['empresaId', 'faturaId', 'faturaParcela'],
            referencedTableName: 'faturas_parcelas',
            referencedColumnNames: ['empresaId', 'faturaId', 'parcela'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['operadorId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );

    await queryRunner.query(`DROP TRIGGER IF EXISTS pessoas_extrato_before_insert`);
    await queryRunner.query(`
CREATE TRIGGER pessoas_extrato_before_insert
BEFORE INSERT ON pessoas_extrato
FOR EACH ROW
BEGIN
      IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
          SET NEW.valor = -NEW.valor;
      ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
          SET NEW.valor = ABS(NEW.valor);
      END IF;

      IF NEW.tipoMovimento = 'Débito' THEN
        SET NEW.descricao = 'DEBITO EM ADIANTAMENTO';
      ELSEIF NEW.tipoMovimento = 'Crédito' THEN
        SET NEW.descricao = 'CREDITO EM ADIANTAMENTO';
      END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS pessoas_extrato_before_update`);
    await queryRunner.query(`
CREATE TRIGGER pessoas_extrato_before_update
BEFORE UPDATE ON pessoas_extrato
FOR EACH ROW
BEGIN
      IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
          SET NEW.valor = -NEW.valor;
      ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
          SET NEW.valor = ABS(NEW.valor);
      END IF;

      IF NEW.tipoMovimento = 'Débito' THEN
        SET NEW.descricao = 'DEBITO EM ADIANTAMENTO';
      ELSEIF NEW.tipoMovimento = 'Crédito' THEN
        SET NEW.descricao = 'CREDITO EM ADIANTAMENTO';
      END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas_extrato');
  }
}
