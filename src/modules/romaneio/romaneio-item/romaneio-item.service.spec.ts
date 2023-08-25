import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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
            insert: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getRawOne: jest.fn().mockResolvedValue({ sequencia: 1 }),
            }),
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
            usuario: jest.fn().mockReturnValue(userFakeRepository.findOne()),
            empresa: jest.fn().mockReturnValue(empresaFakeRepository.findOne()),
            operadorId: jest.fn().mockReturnValue(1),
            empresaId: jest.fn().mockReturnValue(1),
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

  describe('add', () => {
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

      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(null);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when stock balance is insufficient', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1 } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 5 } as any;

      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
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

      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValue([{ quantidade: 5 }] as any);
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

      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValue([{ quantidade: 5 }] as any);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValue(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValue(precoReferencia);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when devolution balance is insufficient', async () => {
      const romaneioId = 10;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1, data: new Date('2023-06-05') } as any;
      const romaneio = { ...romaneioFakeRepository.findOneView(), romaneiosDevolucao: [2] } as any;
      const romaneiosDevolucao = [{ ...romaneioFakeRepository.findOneViewItem(), romaneioId: 2, romaneiosDevolucao: [] }] as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;
      const romaneioItem = [{ romaneiosDevolucao: [2], produtoId: 1, quantidade: 5 }] as any;

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(contextService, 'empresa').mockReturnValueOnce(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce([{ quantidade: 10 }] as any);
      jest.spyOn(view, 'findOne').mockResolvedValueOnce({ quantidade: 10 } as any);
      jest.spyOn(service, 'findByRomaneioIds').mockResolvedValue(romaneiosDevolucao);

      await expect(service.add(romaneioId, { produtoId, quantidade })).rejects.toThrowError(
        `Saldo de devolução do produto "${produtoId}" insuficiente para realizar a operação`
      );
    });

    it('should add a new item of devolucao at the romaneio without itens', async () => {
      const romaneioId = 10;
      const produtoId = 1;
      const quantidade = 2;
      const romaneio = { ...romaneioFakeRepository.findOneView(), romaneiosDevolucao: [2, 3] } as any;
      const romaneiosDevolucao = [
        { ...romaneioFakeRepository.findOneViewItem(), romaneioId: 2, devolvido: 1, quantidade: 2, romaneiosDevolucao: 2 },
        { ...romaneioFakeRepository.findOneViewItem(), romaneioId: 3, devolvido: 0, quantidade: 1, romaneiosDevolucao: 3 },
      ] as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;
      const romaneioItem = [] as any;

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByRomaneioIds').mockResolvedValue(romaneiosDevolucao);
      jest.spyOn(view, 'findOne').mockResolvedValueOnce({ quantidade } as any);
      jest.spyOn(service, 'insert').mockResolvedValueOnce();

      await service.add(romaneioId, { produtoId, quantidade });

      expect(service.insert).toHaveBeenCalledTimes(2);
      expect(service.insert).toHaveBeenCalledWith({
        romaneioId,
        produtoId,
        quantidade,
        referenciaId: estoque.referenciaId,
        valorUnitario: expect.any(Number),
        valorUnitDesconto: expect.any(Number),
        romaneioDevolucaoId: expect.any(Number),
      });
    });

    it('should add a new item of devolucao at the romaneio with itens', async () => {
      const romaneioId = 10;
      const produtoId = 1;
      const quantidade = 2;
      const romaneio = { ...romaneioFakeRepository.findOneView(), romaneiosDevolucao: [2, 3] } as any;
      const romaneiosDevolucao = [
        { ...romaneioFakeRepository.findOneViewItem(), romaneioId: 2, devolvido: 1, quantidade: 3, romaneiosDevolucao: 2 },
        { ...romaneioFakeRepository.findOneViewItem(), romaneioId: 3, devolvido: 0, quantidade: 1, romaneiosDevolucao: 3 },
      ] as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;
      const romaneioItem = [{ romaneioDevolucaoId: 2, produtoId: 1, quantidade: 1 }] as any;

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByRomaneioIds').mockResolvedValue(romaneiosDevolucao);
      jest.spyOn(view, 'findOne').mockResolvedValueOnce({ quantidade } as any);
      jest.spyOn(service, 'insert').mockResolvedValueOnce();

      await service.add(romaneioId, { produtoId, quantidade });

      expect(service.insert).toHaveBeenCalledTimes(2);
      expect(service.insert).toHaveBeenCalledWith({
        romaneioId,
        produtoId,
        quantidade: 1,
        referenciaId: estoque.referenciaId,
        valorUnitario: expect.any(Number),
        valorUnitDesconto: expect.any(Number),
        romaneioDevolucaoId: expect.any(Number),
      });
    });

    it('should add a new romaneio item', async () => {
      const romaneioId = 1;
      const produtoId = 1;
      const quantidade = 10;
      const empresa = { id: 1, data: new Date('2023-06-05') } as any;
      const estoque = { produtoId, referenciaId: 1, saldo: 20 } as any;
      const precoReferencia = { preco: 10 } as any;
      const romaneioItem = [{ quantidade: 5 }] as any;

      jest.spyOn(contextService, 'empresa').mockReturnValueOnce(empresa);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(estoqueService, 'findByProdutoId').mockResolvedValueOnce(estoque);
      jest.spyOn(precoService, 'findByReferenciaId').mockResolvedValueOnce(precoReferencia);
      jest.spyOn(service, 'findByProdutoId').mockResolvedValueOnce({ quantidade: 15 } as any);
      jest.spyOn(view, 'findOne').mockResolvedValueOnce({ quantidade: 10 } as any);
      jest.spyOn(service, 'insert').mockResolvedValueOnce();

      await service.add(romaneioId, { produtoId, quantidade });

      expect(service.insert).toHaveBeenCalledTimes(1);
      expect(service.insert).toHaveBeenCalledWith({
        romaneioId,
        produtoId,
        quantidade,
        referenciaId: estoque.referenciaId,
        valorUnitario: precoReferencia.preco,
      });
    });
  });

  describe('insert', () => {
    it('should insert a new romaneio item', async () => {
      const empresa = { id: 1, data: new Date('2023-06-05') } as any;
      const usuario = { id: 1 } as any;
      const sequencia = 1;
      const dto = { romaneioId: 1, sequencia: 1, produtoId: 1, quantidade: 10, referenciaId: 1, valorUnitario: 10 };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ sequencia }),
      } as any);

      await service.insert(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(repository.createQueryBuilder().select).toHaveBeenCalledWith('coalesce(max(sequencia), 0) + 1', 'sequencia');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: empresa.id, romaneioId: dto.romaneioId });
      expect(repository.createQueryBuilder().getRawOne).toHaveBeenCalled();
      expect(repository.insert).toHaveBeenCalledWith({
        ...dto,
        empresaId: empresa.id,
        data: expect.any(Date),
        sequencia: sequencia,
        emPromocao: false,
        operadorId: usuario.id,
      });
    });
  });

  describe('find', () => {
    it('should return romaneio items', async () => {
      const romaneioId = 1;

      const result = await service.find(romaneioId);

      expect(view.find).toHaveBeenCalledWith({ where: { romaneioId } });
      expect(result).toEqual(romaneioFakeRepository.findViewItens());
    });
  });

  describe('findByRomaneioIds', () => {
    it('should return romaneio items', async () => {
      const romaneioIds = [1];

      const result = await service.findByRomaneioIds(romaneioIds);

      expect(view.find).toHaveBeenCalledWith({ where: { romaneioId: In(romaneioIds) } });
      expect(result).toEqual(romaneioFakeRepository.findViewItens());
    });
  });

  describe('findByProdutoId', () => {
    it('should return romaneio itens', async () => {
      const romaneioId = 1;
      const produtoId = 2;

      const result = await service.findByProdutoId(romaneioId, produtoId);

      expect(view.find).toHaveBeenCalledWith({ where: { romaneioId, produtoId } });
      expect(result).toEqual(romaneioFakeRepository.findViewItens());
    });
  });

  describe('clear', () => {
    it('should clear romaneio itens', async () => {
      const romaneioId = 1;

      await service.clear(romaneioId);

      expect(repository.delete).toHaveBeenCalledWith({ romaneioId });
    });

    it('should throw BadRequestException when romaneio situação canceldo', async () => {
      const romaneioId = 1;

      jest.spyOn(romaneioService, 'findById').mockResolvedValue({ situacao: 'Cancelado' } as any);

      await expect(service.clear(romaneioId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should update romaneio item quantidade', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const usuario = { id: 1 } as any;
      const romaneioItem = { ...romaneioFakeRepository.findOneViewItem(), quantidade: 10 };

      jest.spyOn(view, 'findOne').mockResolvedValueOnce(romaneioItem);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.remove(romaneioId, produtoId, quantidade);

      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });
      expect(repository.update).toHaveBeenCalledWith(
        { romaneioId, produtoId, sequencia: 1 },
        { quantidade: 10 - quantidade, operadorId: usuario.id }
      );
    });

    it('should throw BadRequestException if item not found', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;

      jest.spyOn(view, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.remove(romaneioId, produtoId, quantidade)).rejects.toThrow(BadRequestException);
      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });
    });

    it('should throw BadRequestException if romaneio item is not in EmAndamento state', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const romaneioItem = { ...romaneioFakeRepository.findOneViewItem(), situacao: SituacaoRomaneio.Cancelado } as any;

      jest.spyOn(view, 'findOne').mockResolvedValueOnce(romaneioItem);

      await expect(service.remove(romaneioId, produtoId, quantidade)).rejects.toThrow(BadRequestException);
      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });
    });

    it('should delete romaneio item if quantidade is equal or less than 0', async () => {
      const romaneioId = 1;
      const produtoId = 2;
      const quantidade = 3;
      const romaneioItem = romaneioFakeRepository.findOneViewItem();

      jest.spyOn(view, 'findOne').mockResolvedValueOnce(romaneioItem);

      await service.remove(romaneioId, produtoId, quantidade);

      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });
      expect(repository.delete).toHaveBeenCalledWith({ romaneioId, produtoId, sequencia: romaneioItem.sequencia });
    });
  });
});
