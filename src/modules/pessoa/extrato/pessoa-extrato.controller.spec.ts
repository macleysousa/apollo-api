import { Test, TestingModule } from '@nestjs/testing';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { TipoDocumento } from './enum/tipo-documento.enum';
import { PessoaExtratoController } from './pessoa-extrato.controller';
import { PessoaExtratoService } from './pessoa-extrato.service';

describe('PessoaExtratoController', () => {
  let controller: PessoaExtratoController;
  let service: PessoaExtratoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaExtratoController],
      providers: [
        {
          provide: PessoaExtratoService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PessoaExtratoController>(PessoaExtratoController);
    service = module.get<PessoaExtratoService>(PessoaExtratoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (GET)', () => {
    it('should return an array of PessoaExtratoEntity', async () => {
      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Adiantamento,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.find(1, [], new Date(), new Date())).toBe(result);
    });
  });

  describe('/adiantamentos (GET)', () => {
    it('should return an array of PessoaExtratoEntity with tipoDocumento = TipoDocumento.Adiantamento', async () => {
      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Adiantamento,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.findAdiantamentos(1, [], new Date(), new Date())).toBe(result);
      expect(service.find).toHaveBeenCalledWith({
        empresaIds: [],
        pessoaId: 1,
        dataInicio: expect.any(Date),
        dataFim: expect.any(Date),
        tipoDocumento: [TipoDocumento.Adiantamento],
      });
    });
  });

  describe('/credito-de-devolucao (GET)', () => {
    it('should return an array of PessoaExtratoEntity with tipoDocumento = TipoDocumento.Credito_de_Devolucao', async () => {
      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Credito_de_Devolucao,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.findCreditoDeDevolucao(1, [], new Date(), new Date())).toBe(result);
      expect(service.find).toHaveBeenCalledWith({
        empresaIds: [],
        pessoaId: 1,
        dataInicio: expect.any(Date),
        dataFim: expect.any(Date),
        tipoDocumento: [TipoDocumento.Credito_de_Devolucao],
      });
    });
  });
});
