import { Test, TestingModule } from '@nestjs/testing';
import { brandFakeRepository } from 'src/base-fake/brand';

import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

describe('BrandController', () => {
  let controller: MarcaController;
  let service: MarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcaController],
      providers: [
        {
          provide: MarcaService,
          useValue: {
            create: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(brandFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MarcaController>(MarcaController);
    service = module.get<MarcaService>(MarcaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new brand', async () => {
      // Arrange
      const brand: CreateMarcaDto = { nome: 'Name', inativa: true };

      // Act
      const result = await controller.create(brand);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(brand);

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list of brands', async () => {
      // Arrange
      const name = undefined;
      const active = undefined;

      // Act
      const result = await controller.find(name, active);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, active);

      expect(result).toEqual(brandFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a brand', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a brand', async () => {
      // Arrange
      const id = 1;
      const brand: UpdateMarcaDto = { nome: 'Name', inativa: true };

      // Act
      const result = await controller.update(id, brand);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, brand);

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a brand', async () => {
      // Arrange
      const id = 1;

      // Act
      await controller.remove(id);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
