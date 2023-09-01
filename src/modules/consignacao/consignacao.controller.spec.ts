import { Test, TestingModule } from '@nestjs/testing';

import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { ConsignacaoController } from './consignacao.controller';
import { ConsignacaoService } from './consignacao.service';
import { CancelConsinacaoDto } from './dto/cancelar-consignacao.dto';
import { OpenConsignacaoDto } from './dto/open-consignacao.dto';
import { UpdateConsignacaoDto } from './dto/update-consignacao.dto';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { ConsignacaoFilter } from './filters/consignacao-filter';
import { ConsignacaoIncluir } from './includes/consignacao.includ';

describe('ConsignacaoController', () => {
  let controller: ConsignacaoController;
  let service: ConsignacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignacaoController],
      providers: [
        {
          provide: ConsignacaoService,
          useValue: {
            find: jest.fn(),
            open: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            calculate: jest.fn(),
            cancel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConsignacaoController>(ConsignacaoController);
    service = module.get<ConsignacaoService>(ConsignacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should return an array of consignacoes', async () => {
      const dto: ConsignacaoFilter = { empresaId: 1 } as ConsignacaoFilter;

      const consignacoes = [
        { id: 1, empresaId: 1, dataAbertura: new Date(), situacao: 'aberta' },
        { id: 2, empresaId: 1, dataAbertura: new Date(), situacao: 'cancelada' },
      ] as ConsignacaoEntity[];

      jest.spyOn(service, 'find').mockResolvedValueOnce(consignacoes);

      expect(await controller.find(dto)).toBe(consignacoes);
    });
  });

  describe('/abrir (POST)', () => {
    it('should create a new consignacao', async () => {
      const dto = { caixaAbertura: 1, pessoaId: 1 } as OpenConsignacaoDto;

      const consignacao: ConsignacaoEntity = { id: 1, ...dto, situacao: 'aberta' } as unknown as ConsignacaoEntity;

      jest.spyOn(service, 'open').mockResolvedValueOnce(consignacao);

      expect(await controller.create(dto)).toBe(consignacao);
    });
  });

  describe(':id (GET)', () => {
    it('should return a consignacao by id', async () => {
      const empresa: EmpresaEntity = { id: 1 } as EmpresaEntity;
      const consignacao = { id: 1, empresaId: 1 } as ConsignacaoEntity;
      const includes: ConsignacaoIncluir[] = ['itens'];

      jest.spyOn(service, 'findById').mockResolvedValueOnce(consignacao);

      expect(await controller.findById(empresa, consignacao.id, includes)).toBe(consignacao);
    });
  });

  describe(':id/atualizar (PUT)', () => {
    it('should update a consignacao by id', async () => {
      const empresa = { id: 1 } as EmpresaEntity;
      const id = 1;
      const dto = { funcionarioId: 1 } as UpdateConsignacaoDto;

      const consignacao = { id, empresaId: 1 } as ConsignacaoEntity;

      jest.spyOn(service, 'update').mockResolvedValueOnce(consignacao);

      expect(await controller.atualizar(empresa, id, dto)).toBe(consignacao);
    });
  });

  describe(':id/recalcular', () => {
    it('should recalculate a consignacao by id', async () => {
      const id = 1;

      jest.spyOn(service, 'calculate').mockResolvedValueOnce(undefined);

      expect(await controller.recalculate(id)).toBe(undefined);
    });
  });

  describe(':id/cancelar', () => {
    it('should cancel a consignacao by id', async () => {
      const empresa = { id: 1 } as EmpresaEntity;
      const id = 1;
      const dto = { motivoCancelamento: 'Motivo de cancelamento' } as CancelConsinacaoDto;

      jest.spyOn(service, 'cancel').mockResolvedValueOnce(undefined);

      expect(await controller.cancel(empresa, id, dto)).toBe(undefined);
    });
  });
});
