import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class createTableUserGroupAccesses1672148663309 implements MigrationInterface {
    name?: string;
    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_groups_accesses',
                columns: [
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'branchId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'groupId',
                        type: 'int',
                        isNullable: false,
                    },
                ],
                uniques: [new TableUnique({ columnNames: ['userId', 'branchId', 'groupId'], name: 'unique_user_group_access' })],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['userId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                        onDelete: 'CASCADE',
                    }),
                    new TableForeignKey({
                        columnNames: ['branchId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'branchs',
                        onDelete: 'CASCADE',
                    }),
                    new TableForeignKey({
                        columnNames: ['groupId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'components_groups',
                        onDelete: 'CASCADE',
                    }),
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_groups_accesses');
    }
}
