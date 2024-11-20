import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddColumnRomaneios1693479478863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'romaneios',
      new TableColumn({
        name: 'consignacaoId',
        type: 'bigint',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex('romaneios', new TableIndex({ columnNames: ['consignacaoId'] }));

    await queryRunner.createForeignKey(
      'romaneios',
      new TableForeignKey({
        columnNames: ['consignacaoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consignacoes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `ALTER TABLE romaneios CHANGE COLUMN consignacaoId consignacaoId BIGINT NULL DEFAULT NULL AFTER pago;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('romaneios', 'FK_5acfde95f395c943fb98e7be54e');
    await queryRunner.dropIndex('romaneios', 'IDX_5acfde95f395c943fb98e7be54');
    await queryRunner.dropColumn('romaneios', 'consignacaoId');
  }
}
