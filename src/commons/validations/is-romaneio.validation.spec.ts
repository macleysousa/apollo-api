import { Test, TestingModule } from '@nestjs/testing';

import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

import { RomaneioConstraint } from './is-romaneio.validation';

describe('RomaneioConstraint', () => {
  let constraint: RomaneioConstraint;
  let service: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioConstraint,
        {
          provide: RomaneioService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    constraint = module.get<RomaneioConstraint>(RomaneioConstraint);
    service = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return true if romaneio exists and has the correct situacao', async () => {
    const romaneioId = 1;
    const situacao = SituacaoRomaneio.EmAndamento;
    const romaneio = { id: romaneioId, situacao } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [situacao] } as any);
    expect(result).toBe(true);
  });

  it('should return false if romaneio does not exist', async () => {
    const romaneioId = 1;
    const situacao = SituacaoRomaneio.EmAndamento;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

    const result = await constraint.validate(romaneioId, { constraints: [situacao] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe('Romaneio não encontrado');
  });

  it('should return false if romaneio has the wrong situacao', async () => {
    const romaneioId = 1;
    const situacao = SituacaoRomaneio.EmAndamento;
    const romaneio = { id: romaneioId, situacao: SituacaoRomaneio.Encerrado } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [situacao] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe(`Romaneio ${romaneioId} não está com a situação ${situacao}`);
  });
});
