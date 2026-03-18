import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsCoresDetails1774000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('cores', [
            new TableColumn({
                name: 'hex',
                type: 'varchar',
                length: '9',
                isNullable: true,
            }),
            new TableColumn({
                name: 'nomeInternacional',
                type: 'varchar',
                length: '255',
                isNullable: true,
            }),
            new TableColumn({
                name: 'base',
                type: 'varchar',
                length: '255',
                isNullable: true,
            }),
            new TableColumn({
                name: 'tags',
                type: 'text',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('cores', ['hex', 'nomeInternacional', 'base', 'tags']);
    }
}
