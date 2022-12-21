import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableComponentGroupItems1671558822130 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'componentGroupItems',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'groupId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'componentId',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
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
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['componentId'],
                        referencedTableName: 'components',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }),
                    new TableForeignKey({
                        columnNames: ['groupId'],
                        referencedTableName: 'componentGroups',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }),
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('componentGroupItems');
    }
}
