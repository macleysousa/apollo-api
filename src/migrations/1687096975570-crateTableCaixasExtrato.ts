import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CrateTableCaixasExtrato1687096975570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixas_extrato',
        columns: [
          {
            name: 'documento',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
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
            name: 'caixaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'tipoHistorico',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'tipoMovimento',
            type: 'enum',
            enum: ['Débito', 'Crédito'],
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'faturaId',
            type: 'bigint',
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
            name: 'operadorId',
            type: 'int',
            isNullable: false,
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
            columnNames: ['caixaId'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['faturaId'],
            referencedTableName: 'faturas',
            referencedColumnNames: ['id'],
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

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_insert`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_before_insert
BEFORE INSERT ON caixas_extrato
FOR EACH ROW
BEGIN
    IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
        SET NEW.valor = -NEW.valor;
    ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
        SET NEW.valor = ABS(NEW.valor);
    END IF;
END;
`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS caixas_extrato_before_update`);
    await queryRunner.query(`
CREATE TRIGGER caixas_extrato_before_update
BEFORE UPDATE ON caixas_extrato
FOR EACH ROW
BEGIN
    IF NEW.tipoMovimento = 'Débito' AND NEW.valor > 0 THEN
        SET NEW.valor = -NEW.valor;
    ELSEIF NEW.tipoMovimento = 'Crédito' AND NEW.valor < 0 THEN
        SET NEW.valor = ABS(NEW.valor);
    END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caixas_extrato');
  }
}
