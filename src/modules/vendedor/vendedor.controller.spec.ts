import { Test, TestingModule } from '@nestjs/testing';
import { VendedorController } from './vendedor.controller';
import { VendedorService } from './vendedor.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';

describe('VendedorController', () => {
  let controller: VendedorController;
  let service: VendedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendedorController],
      providers: [
        {
          provide: VendedorService,
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

    controller = module.get<VendedorController>(VendedorController);
    service = module.get<VendedorService>(VendedorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vendedor', async () => {
      // Arrange
      const createVendedorDto: CreateVendedorDto = {
        nome: 'João',
        empresaId: 1,
      };
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id: 1, ...createVendedorDto });

      jest.spyOn(service, 'create').mockResolvedValueOnce(vendedorEntity);

      // Act
      const result = await controller.create(createVendedorDto);

      // Assert
      expect(result).toBe(vendedorEntity);
      expect(service.create).toHaveBeenCalledWith(createVendedorDto);
    });
  });

  describe('find', () => {
    it('should find vendedores', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = false;
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id: 1, nome, empresaId, inativo });
      const vendedores: VendedorEntity[] = [vendedorEntity];

      jest.spyOn(service, 'find').mockResolvedValueOnce(vendedores);

      // Act
      const result = await controller.find(empresaId, nome, inativo);

      // Assert
      expect(result).toBe(vendedores);
      expect(service.find).toHaveBeenCalledWith(empresaId, nome, inativo);
    });
  });

  describe('findById', () => {
    it('should find a vendedor by id', async () => {
      // Arrange
      const id = 1;
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id, nome: 'João', empresaId: 1 });

      jest.spyOn(service, 'findById').mockResolvedValueOnce(vendedorEntity);

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(result).toBe(vendedorEntity);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a vendedor', async () => {
      // Arrange
      const id = 1;
      const updateVendedorDto: UpdateVendedorDto = { nome: 'João' };
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id, ...updateVendedorDto });

      jest.spyOn(service, 'update').mockResolvedValueOnce(vendedorEntity);

      // Act
      const result = await controller.update(id, updateVendedorDto);

      // Assert
      expect(result).toBe(vendedorEntity);
      expect(service.update).toHaveBeenCalledWith(id, updateVendedorDto);
    });
  });

  describe('delete', () => {
    it('should delete a vendedor', async () => {
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
