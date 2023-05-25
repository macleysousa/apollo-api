import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableBranches1671815503457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'empresas',
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
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nomeFantasia',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ativa',
            type: 'boolean',
            default: true,
          },
          {
            name: 'uf',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'inscricaoEstadual',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'codigoDeAtividade',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'codigoDeNaturezaJuridica',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'regime',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'substituicaoTributaria',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'suframa',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'registroMunicipal',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'telefone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('empresas');
  }
}
