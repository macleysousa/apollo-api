import { Test, TestingModule } from '@nestjs/testing';

import { tableaDePrecoFakeRepository } from 'src/base-fake/tabela-de-preco';

import { PrecoReferenciaController } from './referencia.controller';
import { PrecoReferenciaService } from './referencia.service';

describe('ReferenciaController', () => {
  let controller: PrecoReferenciaController;
  let service: PrecoReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrecoReferenciaController],
      providers: [
        {
          provide: PrecoReferenciaService,
          useValue: {
            add: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findOneView()),
            find: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findViewPaginate()),
            findByReferenciaId: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findOneView()),
          },
        },
      ],
    }).compile();

    controller = module.get<PrecoReferenciaController>(PrecoReferenciaController);
    service = module.get<PrecoReferenciaService>(PrecoReferenciaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add preco referencia', async () => {
      const tabelaDePrecoId = 1;
      const upSertPrecoReferenciaDto = { referenciaId: 1, valor: 10 };
      const precoReferenciaView = tableaDePrecoFakeRepository.findOneView();

      const result = await controller.add(tabelaDePrecoId, upSertPrecoReferenciaDto);

      expect(service.add).toHaveBeenCalledWith(tabelaDePrecoId, upSertPrecoReferenciaDto);
      expect(result).toEqual(precoReferenciaView);
    });
  });

  describe('find', () => {
    it('should find preco referencias by tabela de preco id and referencia ids', async () => {
      const tabelaDePrecoId = 1;
      const referenciaIds = [1, 2, 3];
      const page = 1;
      const limit = 100;

      const pagination = tableaDePrecoFakeRepository.findViewPaginate();

      const result = await controller.find(tabelaDePrecoId, referenciaIds, [], page, limit);

      expect(service.find).toHaveBeenCalledWith(tabelaDePrecoId, { referenciaIds, referenciaIdExternos: [], page, limit });
      expect(result).toEqual(pagination);
    });

    it('should find preco referencias by tabela de preco id and referencia id externos', async () => {
      const tabelaDePrecoId = 1;
      const referenciaIdExternos = ['ref1', 'ref2', 'ref3'];
      const page = 1;
      const limit = 100;
      const pagination = tableaDePrecoFakeRepository.findViewPaginate();

      const result = await controller.find(tabelaDePrecoId, [], referenciaIdExternos, page, limit);

      expect(service.find).toHaveBeenCalledWith(tabelaDePrecoId, { referenciaIds: [], referenciaIdExternos, page, limit });
      expect(result).toEqual(pagination);
    });
  });

  describe('findByReferenciaId', () => {
    it('should find preco referencia by tabela de preco id and referencia id', async () => {
      const tabelaDePrecoId = 1;
      const referenciaId = 1;
      const precoReferenciaView = tableaDePrecoFakeRepository.findOneView();

      const result = await controller.findByReferenciaId(tabelaDePrecoId, referenciaId);

      expect(service.findByReferenciaId).toHaveBeenCalledWith(tabelaDePrecoId, referenciaId);
      expect(result).toEqual(precoReferenciaView);
    });
  });
});
