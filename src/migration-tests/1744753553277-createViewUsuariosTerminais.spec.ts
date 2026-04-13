import { QueryRunner } from 'typeorm';

import { CreateViewUsuariosTerminais1744753553277 } from 'src/migrations/1744753553277-createViewUsuariosTerminais';

describe('CreateViewUsuariosTerminais1744753553277', () => {
    it('should create the view joining the user-terminal link to the matching terminal', async () => {
        const queryRunner = {
            query: jest.fn().mockResolvedValue(undefined),
        } as unknown as QueryRunner;

        const migration = new CreateViewUsuariosTerminais1744753553277();

        await migration.up(queryRunner);

        expect(queryRunner.query).toHaveBeenCalledWith(
            expect.stringContaining('JOIN empresas_terminais et ON et.empresaId = ut.empresaId AND et.id = ut.terminalId'),
        );
    });
});
