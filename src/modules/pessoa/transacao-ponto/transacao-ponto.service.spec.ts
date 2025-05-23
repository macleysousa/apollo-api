import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';
import { TransacaoPontoService } from './transacao-ponto.service';
import { TransacaoPontoView } from './Views/transacao-ponto.view';

describe('TransacaoPontoService', () => {
  let service: TransacaoPontoService;
  let repository: Repository<TransacaoPontoEntity>;
  let viewRepository: Repository<TransacaoPontoView>;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacaoPontoService,
        {
          provide: getRepositoryToken(TransacaoPontoEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TransacaoPontoView),
          useClass: Repository,
        },
        {
          provide: ContextService,
          useValue: {
            empresaId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<TransacaoPontoService>(TransacaoPontoService);
    repository = module.get<Repository<TransacaoPontoEntity>>(getRepositoryToken(TransacaoPontoEntity));
    viewRepository = module.get<Repository<TransacaoPontoView>>(getRepositoryToken(TransacaoPontoView));
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(viewRepository).toBeDefined();
    expect(contextService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const pessoaId = 1;
      const dto: CreateTransacaoPontoDto = { quantidade: 100, validaAte: new Date() };
      const savedEntity = { id: 1, ...dto, pessoaId, empresaId: 1 };

      (repository as any).manager = {
        findOne: jest.fn().mockResolvedValue({ id: pessoaId, documento: '123456789' }),
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedEntity as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedEntity as any);
      jest.spyOn(service, 'findById').mockResolvedValue(savedEntity as any);

      const result = await service.create(pessoaId, dto);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        pessoaDocumento: '123456789',
        tipo: 'Crédito',
        pessoaId,
        empresaId: 1,
      });
      expect(repository.save).toHaveBeenCalledWith(savedEntity);
      expect(result).toEqual(savedEntity);
    });

    it('should throw BadRequestException on save error', async () => {
      const pessoaId = 1;
      const dto: CreateTransacaoPontoDto = { quantidade: 100, validaAte: new Date() };

      (repository as any).manager = {
        findOne: jest.fn().mockResolvedValue({ id: pessoaId, documento: '123456789' }),
      };

      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Save error'));
      jest.spyOn(service, 'findById').mockResolvedValue({} as any);

      await expect(service.create(pessoaId, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('find', () => {
    it('should return filtered transactions', async () => {
      const pessoaId = 1;
      const filter: TransacaoPontoFilter = { tipos: ['Débito', 'Crédito'], empresaIds: [2] };
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      };

      jest.spyOn(viewRepository, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await service.find(pessoaId, filter);

      expect(queryBuilder.where).toHaveBeenCalledWith('t.pessoaId = :pessoaId', { pessoaId });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('t.empresaId IN (:...empresaIds)', { empresaIds: [1, 2] });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('t.tipo IN (:...tipos)', { tipos: ['Débito', 'Crédito'] });
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('t.data', 'DESC');
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findById', () => {
    it('should return a transaction by ID', async () => {
      const pessoaId = 1;
      const id = 1;
      const transaction = { id, pessoaId, empresaId: 1 };

      jest.spyOn(service, 'find').mockResolvedValue([transaction as any]);

      const result = await service.findById(pessoaId, id);

      expect(service.find).toHaveBeenCalledWith(pessoaId, { ids: [id] });
      expect(result).toEqual(transaction);
    });

    it('should throw BadRequestException on error', async () => {
      const pessoaId = 1;
      const id = 1;

      jest.spyOn(service, 'find').mockRejectedValue(new Error('Find error'));

      await expect(service.findById(pessoaId, id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel a transaction', async () => {
      const pessoaId = 1;
      const id = 1;
      const dto = { motivoCancelamento: 'Duplicate transaction' };
      const updatedTransaction = { id, pessoaId, empresaId: 1, cancelado: true, motivoCancelamento: dto.motivoCancelamento };

      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValue(updatedTransaction as any);

      const result = await service.cancel(pessoaId, id, dto);

      expect(repository.update).toHaveBeenCalledWith(
        { id, pessoaId, empresaId: 1 },
        { cancelada: true, motivoCancelamento: dto.motivoCancelamento },
      );
      expect(service.findById).toHaveBeenCalledWith(pessoaId, id);
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw BadRequestException on update error', async () => {
      const pessoaId = 1;
      const id = 1;
      const dto = { motivoCancelamento: 'Duplicate transaction' };

      jest.spyOn(repository, 'update').mockRejectedValue(new Error('Update error'));

      await expect(service.cancel(pessoaId, id, dto)).rejects.toThrow(BadRequestException);
    });
  });
});
