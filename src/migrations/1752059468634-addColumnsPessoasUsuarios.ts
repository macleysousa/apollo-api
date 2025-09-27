import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsPessoasUsuarios1752059468634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pessoas_usuarios',
      new TableColumn({
        name: 'telefone',
        type: 'varchar',
        isNullable: true,
        comment: 'Formato +[código do país][número] (ex: +5588999999999)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pessoas_usuarios', 'telefone');
  }
}
