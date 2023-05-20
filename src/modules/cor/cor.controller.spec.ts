import { Test, TestingModule } from '@nestjs/testing';
import { colorFakeRepository } from 'src/base-fake/color';
import { CorController } from './cor.controller';
import { CorService } from './cor.service';
import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';

describe('ColorController', () => {
  let controller: CorController;
  let service: CorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorController],
      providers: [
        {
          provide: CorService,
          useValue: {
            create: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(colorFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CorController>(CorController);
    service = module.get<CorService>(CorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new color', async () => {
      //Arrange
      const color: CreateCorDto = { id: 1, nome: 'RED', inativa: true };

      // Act
      const result = await controller.create(color);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(color);

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a color list', async () => {
      const name = 'back';
      const active = true;

      // Act
      const result = await controller.find(name, active);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, active);

      expect(result).toEqual(colorFakeRepository.find());
    });
  });

  describe('/{:id} (GET)', () => {
    it('should return a color', async () => {
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('/{:id} (PUT)', () => {
    it('should update color', async () => {
      // Arrange
      const id = 1;
      const color: UpdateCorDto = { nome: 'white', inativa: false };

      // Act
      const result = await controller.update(id, color);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, color);

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('/{:id} (DELETE)', () => {
    it('should delete color', async () => {
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
