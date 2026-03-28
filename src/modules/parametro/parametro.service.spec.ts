import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { EmpresaParametroEntity } from '../empresa/parametro/entities/parametro.entity';

import { ParametroEntity } from './entities/parametro.entity';
import { ParametroService } from './parametro.service';

describe('ParametroService', () => {
  let service: ParametroService;
  let repository: Repository<ParametroEntity>;
  let empresaRepository: Repository<EmpresaEntity>;
  let empresaParametroRepository: Repository<EmpresaParametroEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametroService,
        {
          provide: getRepositoryToken(ParametroEntity),
          useValue: {
            insert: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EmpresaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(EmpresaParametroEntity),
          useValue: {
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ParametroService>(ParametroService);
    repository = module.get<Repository<ParametroEntity>>(getRepositoryToken(ParametroEntity));
    empresaRepository = module.get<Repository<EmpresaEntity>>(getRepositoryToken(EmpresaEntity));
    empresaParametroRepository = module.get<Repository<EmpresaParametroEntity>>(getRepositoryToken(EmpresaParametroEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(empresaRepository).toBeDefined();
    expect(empresaParametroRepository).toBeDefined();
  });

  describe('popular', () => {
    it('should insert only missing base parameters', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await service.popular();

      expect(repository.insert).toHaveBeenCalled();
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
