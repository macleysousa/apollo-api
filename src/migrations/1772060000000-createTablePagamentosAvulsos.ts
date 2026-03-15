import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTablePagamentosAvulsos1772060000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'pagamentos_avulsos',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'empresaId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'usuarioId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'provider',
                        type: 'varchar',
                        length: '30',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '20',
                        default: "'pending'",
                    },
                    {
                        name: 'amount',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'externalReference',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'idempotencyKey',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'externalId',
                        type: 'varchar',
                        length: '150',
                        isNullable: true,
                    },
                    {
                        name: 'customerNome',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'customerDocumento',
                        type: 'varchar',
                        length: '40',
                        isNullable: true,
                    },
                    {
                        name: 'customerEmail',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'customerTelefone',
                        type: 'varchar',
                        length: '30',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'requisicaoGateway',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'respostaGateway',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'pagoEm',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'canceladoEm',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'motivoCancelamento',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'criadoEm',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'atualizadoEm',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                indices: [
                    {
                        name: 'IDX_pagamentos_avulsos_empresa_status',
                        columnNames: ['empresaId', 'status'],
                    },
                    {
                        name: 'IDX_pagamentos_avulsos_provider_external',
                        columnNames: ['provider', 'externalId'],
                    },
                ],
                uniques: [
                    {
                        name: 'UQ_pagamentos_avulsos_empresa_idempotency',
                        columnNames: ['empresaId', 'idempotencyKey'],
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['empresaId'],
                        referencedTableName: 'empresas',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        columnNames: ['usuarioId'],
                        referencedTableName: 'usuarios',
                        referencedColumnNames: ['id'],
                        onDelete: 'RESTRICT',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pagamentos_avulsos');
    }
}
