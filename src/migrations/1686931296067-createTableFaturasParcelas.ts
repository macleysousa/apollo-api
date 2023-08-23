import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFaturasParcelas1686931296067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'faturas_parcelas',
        columns: [
          {
            name: 'empresaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'faturaId',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'parcela',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'valor',
            type: 'decimal(10,4)',
            isNullable: false,
          },
          {
            name: 'vencimento',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'valorDesconto',
            type: 'decimal(10,4)',
            default: 0,
          },
          {
            name: 'caixaPagamento',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'valorPago',
            type: 'decimal(10,4)',
            isNullable: true,
          },
          {
            name: 'pagamento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'situacao',
            type: 'varchar',
            default: "'Normal'",
          },
          {
            name: 'banco',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'agencia',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'conta',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'documento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nsu',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'autorizacao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cheque',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'banda',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'chequerTerceiro',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'cpfCnpjTerceiro',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nomeTerceiro',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'telefoneTerceiro',
            type: 'varchar',
            isNullable: true,
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
        foreignKeys: [
          {
            columnNames: ['empresaId'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['faturaId'],
            referencedTableName: 'faturas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['caixaPagamento'],
            referencedTableName: 'caixas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('faturas_parcelas');
  }
}
