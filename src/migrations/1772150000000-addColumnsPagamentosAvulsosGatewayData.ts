import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsPagamentosAvulsosGatewayData1772150000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pagamentos_avulsos
                ADD COLUMN qrCodePix text NULL,
                ADD COLUMN chavePixCopiaECola text NULL,
                ADD COLUMN urlDePagamento varchar(500) NULL,
                ADD COLUMN urlComprovante varchar(500) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pagamentos_avulsos
                DROP COLUMN urlComprovante,
                DROP COLUMN urlDePagamento,
                DROP COLUMN chavePixCopiaECola,
                DROP COLUMN qrCodePix
        `);
    }
}
