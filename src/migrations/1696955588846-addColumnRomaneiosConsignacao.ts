import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnRomaneiosConsignacao1696955588846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('romaneios', new TableColumn({ name: 'romaneiosConsignacao', type: 'text', isNullable: true }));
    await queryRunner.query(
      'ALTER TABLE romaneios CHANGE COLUMN romaneiosConsignacao romaneiosConsignacao TEXT NULL DEFAULT NULL AFTER romaneiosDevolucao',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('romaneios', 'romaneiosConsignacao');
  }
}
