import { QueryRunner } from 'typeorm';

import { FixViewUsuariosTerminaisJoin1775400000000 } from 'src/migrations/1775400000000-fixViewUsuariosTerminaisJoin';

describe('FixViewUsuariosTerminaisJoin1775400000000', () => {
  it('should recreate the view using the terminal link keys', async () => {
    const queryRunner = {
      query: jest.fn().mockResolvedValue(undefined),
    } as unknown as QueryRunner;

    const migration = new FixViewUsuariosTerminaisJoin1775400000000();

    await migration.up(queryRunner);

    expect(queryRunner.query).toHaveBeenCalledWith(
      expect.stringContaining('JOIN empresas_terminais et ON et.empresaId = ut.empresaId AND et.id = ut.terminalId'),
    );
  });
});
