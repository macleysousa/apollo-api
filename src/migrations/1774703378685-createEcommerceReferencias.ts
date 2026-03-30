import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEcommerceReferencias1774703378685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ecommerces_referencias',
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
          },
          {
            name: 'ecommerceId',
            type: 'int',
          },
          {
            name: 'referenciaId',
            type: 'int',
          },
          {
            name: 'tabelaDePrecoId',
            type: 'int',
          },
          {
            name: 'rascunho',
            type: 'boolean',
            default: true,
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        uniques: [{ columnNames: ['ecommerceId', 'empresaId', 'referenciaId'] }],
        foreignKeys: [
          {
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            columnNames: ['empresaId'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            referencedTableName: 'ecommerces',
            referencedColumnNames: ['id'],
            columnNames: ['ecommerceId'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            referencedTableName: 'referencias',
            referencedColumnNames: ['id'],
            columnNames: ['referenciaId'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            referencedTableName: 'tabelas_de_precos',
            referencedColumnNames: ['id'],
            columnNames: ['tabelaDePrecoId'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(`DROP VIEW IF EXISTS view_ecommerces_referencias`);

    await queryRunner.query(`
CREATE VIEW view_ecommerces_referencias AS
SELECT
  er.id,
  er.ecommerceId,
  er.empresaId,
  er.referenciaId,
  r.nome,
  r.idExterno,
  r.unidadeMedida,
  r.categoriaId,
  r.subCategoriaId,
  r.marcaId,
  r.descricao,
  r.composicao,
  r.cuidados,
  er.tabelaDePrecoId,
  pr.valor,
  rm.type as media_tipo,
  rm.url as media_url,
  er.rascunho,
  er.criadoEm,
  er.atualizadoEm
FROM ecommerces_referencias er
JOIN referencias r ON r.id = er.referenciaId
LEFT JOIN tabelas_de_precos_referencias pr ON pr.referenciaId = er.referenciaId AND pr.tabelaDePrecoId = er.tabelaDePrecoId
LEFT JOIN referencias_medias rm ON rm.referenciaId = er.referenciaId AND rm.isDefault = 1 AND rm.isPublic = 1
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS view_ecommerces_referencias`);
    await queryRunner.dropTable('ecommerces_referencias');
  }
}
