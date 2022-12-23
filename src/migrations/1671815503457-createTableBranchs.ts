import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableBranchs1671815503457 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'branchs',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'cnpj',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'fantasyName',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'isInactive',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'uf',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'numberStateRegistration',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'codeActivity',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'codeActivityCnae',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'typeTaxRegime',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'typeSubTributary',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'suframaCode',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'registrationMunicipal',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('branchs');
    }
}
