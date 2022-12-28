import { MigrationInterface, QueryRunner } from 'typeorm';

export class createViewUserAccesses1672249961246 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
CREATE OR REPLACE VIEW user_accesses AS
    select distinct
    u.id,
    ug.branchId,
    ug.groupId,
    cg.name 'groupName',
    cgi.componentId,
    c.name 'componentName',
    c.blocked from users as u
inner join users_groups_accesses ug on ug.userId = u.id
inner join components_groups cg on cg.id = ug.groupId
inner join components_groups_items cgi on cgi.groupId = ug.groupId
inner join components c on c.id = cgi.componentId
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW user_accesses`);
    }
}
