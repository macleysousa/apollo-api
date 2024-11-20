import { Test, TestingModule } from '@nestjs/testing';

import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioEntity } from './entities/funcionario.entity';
import { FuncionarioController } from './funcionario.controller';
import { FuncionarioService } from './funcionario.service';

describe('FuncionarioController', () => {
  let controller: FuncionarioController;
  let service: FuncionarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuncionarioController],
      providers: [
        {
          provide: FuncionarioService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FuncionarioController>(FuncionarioController);
    service = module.get<FuncionarioService>(FuncionarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a funcionario', async () => {
      // Arrange
      const createFuncionarioDto: CreateFuncionarioDto = {
        nome: 'João',
        empresaId: 1,
      };
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id: 1, ...createFuncionarioDto });

      jest.spyOn(service, 'create').mockResolvedValueOnce(funcionarioEntity);

      // Act
      const result = await controller.create(createFuncionarioDto);

      // Assert
      expect(result).toBe(funcionarioEntity);
      expect(service.create).toHaveBeenCalledWith(createFuncionarioDto);
    });
  });

  describe('find', () => {
    it('should find funcionarios', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = false;
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id: 1, nome, empresaId, inativo });
      const funcionarios: FuncionarioEntity[] = [funcionarioEntity];

      jest.spyOn(service, 'find').mockResolvedValueOnce(funcionarios);

      // Act
      const result = await controller.find(empresaId, nome, inativo);

      // Assert
      expect(result).toBe(funcionarios);
      expect(service.find).toHaveBeenCalledWith(empresaId, nome, inativo);
    });
  });

  describe('findById', () => {
    it('should find a funcionario by id', async () => {
      // Arrange
      const id = 1;
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id, nome: 'João', empresaId: 1 });

      jest.spyOn(service, 'findById').mockResolvedValueOnce(funcionarioEntity);

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(result).toBe(funcionarioEntity);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a funcionario', async () => {
      // Arrange
      const id = 1;
      const updateFuncionarioDto: UpdateFuncionarioDto = { nome: 'João' };
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id, ...updateFuncionarioDto });

      jest.spyOn(service, 'update').mockResolvedValueOnce(funcionarioEntity);

      // Act
      const result = await controller.update(id, updateFuncionarioDto);

      // Assert
      expect(result).toBe(funcionarioEntity);
      expect(service.update).toHaveBeenCalledWith(id, updateFuncionarioDto);
    });
  });

  describe('delete', () => {
    it('should delete a funcionario', async () => {
      // Arrange
      const id = 1;

      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      // Act
      const result = await controller.remove(id);

      // Assert
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
