import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddColumnRomaneios1694453164053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'romaneios',
      new TableColumn({
        name: 'pedidoId',
        type: 'bigint',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex('romaneios', new TableIndex({ columnNames: ['pedidoId'] }));

    await queryRunner.createForeignKey(
      'romaneios',
      new TableForeignKey({
        columnNames: ['pedidoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pedidos',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `ALTER TABLE romaneios CHANGE COLUMN pedidoId pedidoId BIGINT NULL DEFAULT NULL AFTER consignacaoId;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('romaneios', 'FK_b613a2000cb5cf0956565ce8018');
    await queryRunner.dropIndex('romaneios', 'IDX_b613a2000cb5cf0956565ce801');
    await queryRunner.dropColumn('romaneios', 'pedidoId');
  }
}
