import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { ParametroEntity } from './entities/parametro.entity';
import { ParametroService } from './parametro.service';

describe('ParametroService', () => {
  let service: ParametroService;
  let repository: Repository<ParametroEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametroService,
        {
          provide: getRepositoryToken(ParametroEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ParametroService>(ParametroService);
    repository = module.get<Repository<ParametroEntity>>(getRepositoryToken(ParametroEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('popular', () => {
    it('should call repository.save called times 1', async () => {
      await service.popular();

      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('should call repository.find with the correct parameters', async () => {
      const id = 'CD_PRECO_PADRAO';
      const descricao = 'Tabela de preço padrão';

      await service.find(id, descricao);

      expect(repository.find).toHaveBeenCalledWith({
        where: { id: ILike(`%${id ?? ''}%`), descricao: ILike(`%${descricao ?? ''}%`) },
      });
    });

    it('should call service.find with empty parameters if none are provided', async () => {
      const id = undefined;
      const descricao = undefined;

      await service.find(id, descricao);

      expect(repository.find).toHaveBeenCalledWith({
        where: { id: ILike(`%${id ?? ''}%`), descricao: ILike(`%${descricao ?? ''}%`) },
      });
    });
  });

  describe('findById', () => {
    it('should call repository.findOne with the correct parameters', async () => {
      const id = 'CD_PRECO_PADRAO';

      await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
