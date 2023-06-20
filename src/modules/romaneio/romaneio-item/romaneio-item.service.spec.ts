import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';

import { empresaFakeRepository } from 'src/base-fake/empresa';
import { romaneioFakeRepository } from 'src/base-fake/romaneio';
import { userFakeRepository } from 'src/base-fake/user';
import { RomaneioService } from '../romaneio.service';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemService } from './romaneio-item.service';
import { RomaneioItemView } from './views/romaneio-item.view';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';

describe('RomaneioItemService', () => {
  let service: RomaneioItemService;
  let repository: Repository<RomaneioItemEntity>;
  let view: Repository<RomaneioItemView>;
  let romaneioService: RomaneioService;
  let contextService: ContextService;
  let estoqueService: EstoqueService;
  let precoService: PrecoReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioItemService,
        {
          provide: getRepositoryToken(RomaneioItemEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneViewItem()),
            upsert: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(RomaneioItemView),
          useValue: {
            find: jest.fn().mockResolvedValue(romaneioFakeRepository.findViewItens()),
            findOne: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneViewItem()),
          },
        },
        {
          provide: RomaneioService,
          useValue: {
            findById: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue(userFakeRepository.findOne()),
            currentBranch: jest.fn().mockReturnValue(empresaFakeRepository.findOne()),
          },
        },
        {
          provide: EstoqueService,
          useValue: {
            findByProdutoId: jest.fn(),
          },
        },
        {
          provide: PrecoReferenciaService,
          useValue: {
            findByReferenciaId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RomaneioItemService>(RomaneioItemService);
    repository = module.get<Repository<RomaneioItemEntity>>(getRepositoryToken(RomaneioItemEntity));
    view = module.get<Repository<RomaneioItemView>>(getRepositoryToken(RomaneioItemView));
    romaneioService = module.get<RomaneioService>(RomaneioService);
    contextService = module.get<ContextService>(ContextService);
    estoqueService = module.get<EstoqueService>(EstoqueService);
    precoService = module.get<PrecoReferenciaService>(PrecoReferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
    expect(romaneioService).toBeDefined();
    expect(contextService).toBeDefined();
    expect(estoqueService).toBeDefined();
    expect(precoService).toBeDefined();
  });

  describe('create', () => {
    it('should add first romaneio item', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1, data: new Date('2023-06-05') } as any;
      const usuario = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValueOnce(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(undefined);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce({ quantidade: 10 } as any);

      const result = await service.add(romaneioId, { produtoId, quantidade });

      expect(repository.upsert).toHaveBeenCalledWith(
        {
          empresaId: empresa.id,
          romaneioId,
          data: empresa.data,
          referenciaId: estoque.referenciaId,
          produtoId,
          valorUnitario: precoReferencia.preco,
          emPromocao: false,
          quantidade: quantidade,
          operadorId: usuario.id,
        },
        { conflictPaths: ['empresaId', 'romaneioId', 'produtoId'] }
      );
      expect(result).toBeDefined();
      expect(result.quantidade).toEqual(quantidade);
    });

    it('should add a new romaneio item', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1, data: new Date('2023-06-05') } as any;
      const usuario = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;
      const romaneioItem = { quantidade: 5 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValueOnce(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce({ quantidade: 15 } as any);

      const result = await service.add(romaneioId, { produtoId, quantidade });

      expect(repository.upsert).toHaveBeenCalledWith(
        {
          empresaId: empresa.id,
          romaneioId,
          data: empresa.data,
          referenciaId: estoque.referenciaId,
          produtoId,
          valorUnitario: precoReferencia.preco,
          emPromocao: false,
          quantidade: quantidade + romaneioItem.quantidade,
          operadorId: usuario.id,
        },
        { conflictPaths: ['empresaId', 'romaneioId', 'produtoId'] }
      );
      expect(result).toBeDefined();
      expect(result.quantidade).toEqual(quantidade + romaneioItem.quantidade);
    });

    it('should throw an error when romaneio is not found', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(null);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when romaneio is not in progress', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      jest.spyOn(romaneioService, 'findById').mockResolvedValueOnce({ situacao: 'Cancelado' } as any);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when product is not found in stock', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValue(empresa);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(null);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when stock balance is insufficient', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 5 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValue(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(undefined);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(estoque);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when price is not found for the reference', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValue(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValue({ quantidade: 5 } as any);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValue(null);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when price is zero for the reference', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 0 } as any;

      jest.spyOn(contextService, 'currentBranch').mockReturnValue(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValue({ quantidade: 5 } as any);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValue(precoReferencia);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });
  });

  describe('find', () => {
    it('should return romaneio items', async () => {
      const romaneioId = 1;
      const romaneioItems = [{ id: 1 }, { id: 2 }] as any;

      const result = await service.find(romaneioId);

      expect(view.find).toHaveBeenCalledWith({ where: { romaneioId } });
      expect(result).toEqual(romaneioFakeRepository.findViewItens());
    });
  });

  describe('findByProdutoId', () => {
    it('should return romaneio item', async () => {
      const romaneioId = 1;
      const produtoId = 2;

      const result = await service.findByProdutoId(romaneioId, produtoId);

      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId, produtoId } });
      expect(result).toEqual(romaneioFakeRepository.findOneViewItem());
    });
  });

  describe('remove', () => {
    it('should update romaneio item quantidade', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const usuario = { id: 1 } as any;
      const romaneioItem = { ...romaneioFakeRepository.findOneViewItem(), quantidade: 10 };

      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.remove(romaneioId, produtoId, quantidade);

      expect(service.findByProdutoId).toHaveBeenCalledWith(romaneioId, produtoId);
      expect(repository.update).toHaveBeenCalledWith(
        { romaneioId, produtoId },
        { quantidade: romaneioItem.quantidade - quantidade, operadorId: usuario.id }
      );
    });

    it('should throw BadRequestException if romaneio item is not in EmAndamento state', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const romaneioItem = { ...romaneioFakeRepository.findOneViewItem(), situacao: SituacaoRomaneio.Cancelado } as any;

      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);

      await expect(service.remove(romaneioId, produtoId, quantidade)).rejects.toThrow(BadRequestException);
      expect(service.findByProdutoId).toHaveBeenCalledWith(romaneioId, produtoId);
    });

    it('should delete romaneio item if quantidade is equal or less than 0', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const romaneioItem = romaneioFakeRepository.findOneViewItem();

      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);

      await service.remove(romaneioId, produtoId, quantidade);

      expect(service.findByProdutoId).toHaveBeenCalledWith(romaneioId, produtoId);
      expect(repository.delete).toHaveBeenCalledWith({ romaneioId, produtoId });
    });
  });
});