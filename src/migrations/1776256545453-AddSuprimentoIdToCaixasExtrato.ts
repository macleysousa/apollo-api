import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddSuprimentoIdToCaixasExtrato1776256545453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'caixas_extrato',
      new TableColumn({
        name: 'suprimentoId',
        type: 'bigint',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'caixas_extrato',
      new TableIndex({
        name: 'IDX_caixas_extrato_suprimentoId',
        columnNames: ['suprimentoId'],
      }),
    );

    await queryRunner.createForeignKey(
      'caixas_extrato',
      new TableForeignKey({
        name: 'FK_caixas_extrato_suprimentoId',
        columnNames: ['suprimentoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'caixas_suprimento',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('caixas_extrato', 'FK_caixas_extrato_suprimentoId');
    await queryRunner.dropIndex('caixas_extrato', 'IDX_caixas_extrato_suprimentoId');

    await queryRunner.dropColumn('caixas_extrato', 'suprimentoId');
  }
}
