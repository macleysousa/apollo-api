import { Test, TestingModule } from '@nestjs/testing';

import { caixaFakeRepository } from 'src/base-fake/caixa';
import { ContextService } from 'src/context/context.service';

import { CaixaService } from '../caixa.service';

import { CancelarController } from './cancelar.controller';
import { CancelarService } from './cancelar.service';
import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';

describe('CancelarController', () => {
  let controller: CancelarController;
  let service: CancelarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelarController],
      providers: [
        {
          provide: CancelarService,
          useValue: {
            adiantamento: jest.fn().mockResolvedValue(undefined),
            romaneio: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CaixaService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(caixaFakeRepository.caixaAberto()),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ id: 1 }),
            empresa: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-05') }),
          },
        },
      ],
    }).compile();

    controller = module.get<CancelarController>(CancelarController);
    service = module.get<CancelarService>(CancelarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/adiantamento (PUT)', () => {
    const caixaId = 1;
    const dto: CancelarAdiantamentoDto = { pessoaId: 2, liquidacao: 1687556034328, motivo: 'Motivo' };

    it('should call service.adiantamento with the correct arguments', async () => {
      await controller.adiantamento(caixaId, dto);

      expect(service.adiantamento).toHaveBeenCalledWith(caixaId, dto);
    });
  });

  describe('/romaneio (PUT)', () => {
    it('should call service.romaneio with the correct arguments', async () => {
      const caixaId = 1;
      const dto = { romaneioId: 2, motivo: 'Motivo' };

      await controller.romaneio(caixaId, dto);

      expect(service.romaneio).toHaveBeenCalledWith(caixaId, dto);
    });
  });
});
