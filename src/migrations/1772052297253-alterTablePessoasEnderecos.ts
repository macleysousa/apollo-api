import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AlterTablePessoasEnderecos1772052297253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas_enderecos');

    await queryRunner.createTable(
      new Table({
        name: 'pessoas_enderecos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'pessoaId',
            type: 'int',
            isPrimary: false,
          },
          {
            name: 'principal',
            type: 'boolean',
            default: true,
          },
          {
            name: 'tipoEndereco',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'logradouro',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'municipio',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'uf',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'pais',
            type: 'varchar',
            length: '255',
            default: '"Brasil"',
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
        foreignKeys: [
          {
            referencedTableName: 'pessoas',
            referencedColumnNames: ['id'],
            columnNames: ['pessoaId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoas_enderecos');

    await queryRunner.createTable(
      new Table({
        name: 'pessoas_enderecos',
        columns: [
          {
            name: 'pessoaId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'tipoEndereco',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'logradouro',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'municipio',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'uf',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'pais',
            type: 'varchar',
            length: '255',
            default: '"Brasil"',
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
        foreignKeys: [
          {
            referencedTableName: 'pessoas',
            referencedColumnNames: ['id'],
            columnNames: ['pessoaId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }
}
