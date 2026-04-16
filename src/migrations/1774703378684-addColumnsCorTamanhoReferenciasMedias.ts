import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsCorTamanhoReferenciasMedias1774703378684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('referencias_medias', 'cor'))) {
      await queryRunner.addColumn(
        'referencias_medias',
        new TableColumn({
          name: 'cor',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('referencias_medias', 'tamanho'))) {
      await queryRunner.addColumn(
        'referencias_medias',
        new TableColumn({
          name: 'tamanho',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('referencias_medias', 'tamanho')) {
      await queryRunner.dropColumn('referencias_medias', 'tamanho');
    }

    if (await queryRunner.hasColumn('referencias_medias', 'cor')) {
      await queryRunner.dropColumn('referencias_medias', 'cor');
    }
  }
}
