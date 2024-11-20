import { Test, TestingModule } from '@nestjs/testing';

import { empresaParametroFakeRepository } from 'src/base-fake/empresa-parametro';

import { EmpresaService } from '../empresa.service';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { EmpresaParametroController } from './parametro.controller';
import { EmpresaParametroService } from './parametro.service';
import { EmpresaParametroView } from './views/parametro.view';

describe('ParametroController', () => {
  let controller: EmpresaParametroController;
  let service: EmpresaParametroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaParametroController],
      providers: [
        {
          provide: EmpresaParametroService,
          useValue: {
            create: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findViewOne()),
            find: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findView()),
            findByParametroId: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findViewOne()),
            update: jest.fn().mockResolvedValue(empresaParametroFakeRepository.findViewOne()),
          },
        },
        {
          provide: EmpresaService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<EmpresaParametroController>(EmpresaParametroController);
    service = module.get<EmpresaParametroService>(EmpresaParametroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a parametro', async () => {
      // Arrange
      const empresaId = 1;
      const createParametroDto: CreateParametroDto = { parametroId: 'CD_PRECO_PADRAO', valor: 'valor1' };
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      // Act
      const result = await controller.create(empresaId, createParametroDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(empresaId, createParametroDto);
      expect(result).toEqual(parametroView);
    });
  });

  describe('/ (GET)', () => {
    it('should find parametros', async () => {
      // Arrange
      const empresaId = 1;
      const parametrosView: EmpresaParametroView[] = empresaParametroFakeRepository.findView();

      // Act
      const result = await controller.find(empresaId);

      // Assert
      expect(service.find).toHaveBeenCalledWith(empresaId);
      expect(result).toEqual(parametrosView);
    });
  });

  describe('/:id (GET)', () => {
    it('should find a parametro by parametroId', async () => {
      // Arrange
      const empresaId = 1;
      const parametroId = 'CD_PRECO_PADRAO';
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      // Act
      const result = await controller.findByParametroId(empresaId, parametroId);

      // Assert
      expect(service.findByParametroId).toHaveBeenCalledWith(empresaId, parametroId);
      expect(result).toEqual(parametroView);
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a parametro by parametroId', async () => {
      // Arrange
      const empresaId = 1;
      const parametroId = 'CD_PRECO_PADRAO';
      const updateParametroDto: CreateParametroDto = { parametroId: 'CD_PRECO_PADRAO', valor: 'valor1' };
      const parametroView: EmpresaParametroView = empresaParametroFakeRepository.findViewOne();

      // Act
      const result = await controller.update(empresaId, parametroId, updateParametroDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(empresaId, parametroId, updateParametroDto);
      expect(result).toEqual(parametroView);
    });
  });
});
