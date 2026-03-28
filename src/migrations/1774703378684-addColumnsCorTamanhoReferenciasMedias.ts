import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsCorTamanhoReferenciasMedias1774703378684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('referencias_medias', [
      new TableColumn({
        name: 'cor',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'tamanho',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('referencias_medias', 'tamanho');
    await queryRunner.dropColumn('referencias_medias', 'cor');
  }
}
