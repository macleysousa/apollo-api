import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableProducts1674743625382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produtos',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'idExterno',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'corId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tamanhoId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'referenciaId',
            type: 'int',
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
          new TableForeignKey({
            columnNames: ['corId'],
            referencedTableName: 'cores',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['tamanhoId'],
            referencedTableName: 'tamanhos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['referenciaId'],
            referencedTableName: 'referencias',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('produtos');
  }
}
