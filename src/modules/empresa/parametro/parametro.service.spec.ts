import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaParametroService } from './parametro.service';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { EmpresaParametroEntity } from './entities/parametro.entity';
import { EmpresaParametroView } from './views/parametro.view';
import { empresaParametroFakeRepository } from 'src/base-fake/empresa-parametro';

describe('ParametroService', () => {
  let service: EmpresaParametroService;
  let repository: Repository<EmpresaParametroEntity>;
  let view: Repository<EmpresaParametroView>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaParametroService,
        {
          provide: getRepositoryToken(EmpresaParametroEntity),
          useValue: {
            upsert: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(EmpresaParametroView),
          useValue: {
            find: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findView()),
            findOne: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findViewOne()),
          },
        },
      ],
    }).compile();

    service = module.get<EmpresaParametroService>(EmpresaParametroService);
    repository = module.get<Repository<EmpresaParametroEntity>>(getRepositoryToken(EmpresaParametroEntity));
    view = module.get<Repository<EmpresaParametroView>>(getRepositoryToken(EmpresaParametroView));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
  });

  describe('create', () => {
    it('should create a parametro', async () => {
      // Arrange
      const empresaId = 1;
      const createParametroDto: CreateParametroDto = { parametroId: 'CD_PRECO_PADRAO', valor: 'valor1' };
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      // Act
      const result = await service.create(empresaId, createParametroDto);

      // Assert
      expect(repository.upsert).toHaveBeenCalledWith({ ...createParametroDto, empresaId }, { conflictPaths: ['empresaId', 'parametroId'] });
      expect(result).toEqual(parametroView);
    });
  });

  describe('find', () => {
    it('should find parametros', async () => {
      // Arrange
      const empresaId = 1;
      const parametrosView: EmpresaParametroView[] = empresaParametroFakeRepository.findView();

      // Act
      const result = await service.find(empresaId);

      // Assert
      expect(view.find).toHaveBeenCalledWith({ where: { empresaId } });
      expect(result).toEqual(parametrosView);
    });
  });

  describe('findByParametroId', () => {
    it('should find a parametro by parametroId', async () => {
      // Arrange
      const empresaId = 1;
      const parametroId = 'CD_PRECO_PADRAO';
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      (view.findOne as jest.Mock).mockResolvedValueOnce(parametroView);

      // Act
      const result = await service.findByParametroId(empresaId, parametroId);

      // Assert
      expect(view.findOne).toHaveBeenCalledWith({ where: { empresaId, parametroId } });
      expect(result).toEqual(parametroView);
    });
  });

  describe('update', () => {
    it('should update a parametro', async () => {
      // Arrange
      const empresaId = 1;
      const parametroId = 'CD_PRECO_PADRAO';
      const updateParametroDto: CreateParametroDto = { parametroId: 'CD_PRECO_PADRAO', valor: 'valor1' };
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      // Act
      const result = await service.update(empresaId, parametroId, updateParametroDto);

      // Assert
      expect(repository.upsert).toHaveBeenCalledWith({ ...updateParametroDto, empresaId }, { conflictPaths: ['empresaId', 'parametroId'] });
      expect(result).toEqual(parametroView);
    });
  });
});
