import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFaturas1686909578491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'faturas',
        columns: [
          {
            name: 'id',
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
            name: 'romaneioId',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'pessoaId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'valor',
            type: 'decimal(10,4)',
            isNullable: false,
          },
          {
            name: 'parcelas',
            type: 'int',
            default: 1,
          },
          {
            name: 'tipoDocumento',
            type: 'varchar',
            default: '"Fatura"',
          },
          {
            name: 'tipoMovimento',
            type: 'enum',
            enum: ['Crédito', 'Débito'],
            default: '"Crédito"',
          },
          {
            name: 'tipoInclusao',
            type: 'enum',
            enum: ['Automática', 'Manual'],
          },
          {
            name: 'situacao',
            type: 'varchar',
            default: '"Normal"',
          },
          {
            name: 'observacao',
            type: 'varchar',
            length: '500',
            isNullable: true,
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
        uniques: [{ columnNames: ['id'] }],
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
            columnNames: ['romaneioId'],
            referencedTableName: 'romaneios',
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

    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_after_update`);
    await queryRunner.query(`
CREATE TRIGGER faturas_after_update
AFTER UPDATE ON faturas
FOR EACH ROW
BEGIN
	IF OLD.situacao <> 'Cancelada' AND NEW.situacao = 'Cancelada' THEN
    UPDATE faturas_parcelas SET situacao='Cancelada',operadorId=new.operadorId,motivoCancelamento=new.motivoCancelamento,atualizadoEm=now() WHERE faturaId=NEW.id;
  END IF;
END;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS faturas_after_update`);
    await queryRunner.dropTable('faturas');
  }
}
