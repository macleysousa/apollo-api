import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';
import { TransacaoPontoService } from './transacao-ponto.service';

describe('TransacaoPontoService', () => {
  let service: TransacaoPontoService;
  let repository: Repository<TransacaoPontoEntity>;
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
          provide: ContextService,
          useValue: {
            empresaId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<TransacaoPontoService>(TransacaoPontoService);
    repository = module.get<Repository<TransacaoPontoEntity>>(getRepositoryToken(TransacaoPontoEntity));
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const pessoaId = 1;
      const dto: CreateTransacaoPontoDto = { tipo: 'Crédito', quantidade: 100 };
      const savedEntity = { id: 1, ...dto, pessoaId, empresaId: 1 };

      jest.spyOn(repository, 'create').mockReturnValue(savedEntity as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedEntity as any);

      const result = await service.create(pessoaId, dto);

      expect(repository.create).toHaveBeenCalledWith({ ...dto, pessoaId, empresaId: 1 });
      expect(repository.save).toHaveBeenCalledWith(savedEntity);
      expect(result).toEqual(savedEntity);
    });

    it('should throw BadRequestException on save error', async () => {
      const pessoaId = 1;
      const dto: CreateTransacaoPontoDto = { tipo: 'Crédito', quantidade: 100 };

      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Save error'));

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

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await service.find(pessoaId, filter);

      expect(queryBuilder.where).toHaveBeenCalledWith('t.pessoaId = :pessoaId', { pessoaId });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('t.empresaId IN (:...empresaIds)', { empresaIds: [1, 2] });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('t.tipo IN (:...tipos)', { tipos: ['Resgate', 'Crédito'] });
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('t.dataTransacao', 'DESC');
      expect(result).toEqual([{ id: 1 }]);
    });
  });
});
