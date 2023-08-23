import { Test, TestingModule } from '@nestjs/testing';

import { ContextService } from 'src/context/context.service';

import { CaixaService } from '../caixa.service';
import { ReceberController } from './receber.controller';
import { ReceberService } from './receber.service';
import { CaixaSituacao } from '../enum/caixa-situacao.enum';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { FaturaSituacao } from 'src/modules/fatura/enum/fatura-situacao.enum';

describe('ReceberController', () => {
  let controller: ReceberController;
  let service: ReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceberController],
      providers: [
        {
          provide: ReceberService,
          useValue: {
            adiantamento: jest.fn(),
            fatura: jest.fn(),
            romaneio: jest.fn(),
          },
        },
        {
          provide: CaixaService,
          useValue: {
            findById: jest.fn().mockReturnValue({ id: 1, terminalId: 1, situacao: CaixaSituacao.Aberto }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1 }),
            operadorId: jest.fn().mockReturnValue(1),
            empresaId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    controller = module.get<ReceberController>(ReceberController);
    service = module.get<ReceberService>(ReceberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/adiantamento (POST)', () => {
    it('should call service.adiantamento', async () => {
      const adiantamentoDto = { valor: 10 } as any;
      const caixaId = 1;
      const extrato = { liquidacao: 1 } as any;

      jest.spyOn(service, 'adiantamento').mockResolvedValue(extrato);

      const result = await controller.adiantamento(caixaId, adiantamentoDto);

      expect(service.adiantamento).toBeCalledWith(caixaId, adiantamentoDto);

      expect(result).toEqual(extrato);
    });
  });

  describe('/fatura (POST)', () => {
    it('should call service.fatura', async () => {
      const faturaDto = { valor: 10 } as any;
      const caixaId = 1;

      jest.spyOn(service, 'fatura').mockResolvedValue({ situacao: FaturaSituacao.Encerrada } as any);

      const result = await controller.fatura(caixaId, faturaDto);

      expect(service.fatura).toBeCalledWith(caixaId, faturaDto);

      expect(result).toEqual({ situacao: FaturaSituacao.Encerrada });
    });
  });

  describe('/romaneio (POST)', () => {
    it('should call service.romaneio', async () => {
      const romaneioDto = { romaneioId: 1 } as any;
      const caixaId = 1;

      jest.spyOn(service, 'romaneio').mockResolvedValue({ situacao: SituacaoRomaneio.Encerrado } as any);

      const result = await controller.romaneio(caixaId, romaneioDto);

      expect(service.romaneio).toBeCalledWith(caixaId, romaneioDto);

      expect(result).toEqual({ situacao: SituacaoRomaneio.Encerrado });
    });
  });
});
