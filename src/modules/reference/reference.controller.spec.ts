import { Test, TestingModule } from '@nestjs/testing';
import { referenceFakeRepository } from 'src/base-fake/reference';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';

describe('ReferenceController', () => {
  let controller: ReferenceController;
  let service: ReferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceController],
      providers: [
        {
          provide: ReferenceService,
          useValue: {
            create: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(referenceFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReferenceController>(ReferenceController);
    service = module.get<ReferenceService>(ReferenceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a reference', async () => {
      // Arrange
      const reference: CreateReferenceDto = { id: 1, name: 'test', externalId: '0001' };

      // Act
      const result = await controller.create(reference);

      // Assert
      expect(service.create).toHaveReturnedTimes(1);
      expect(service.create).toHaveBeenCalledWith(reference);

      expect(result).toEqual(referenceFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should get references no filter', async () => {
      // Arrange
      const name = undefined;
      const externalId = undefined;

      // Act
      const result = await controller.find();

      // Assert
      expect(service.find).toHaveReturnedTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, externalId);

      expect(result).toEqual(referenceFakeRepository.find());
    });

    it('should get references with filter', async () => {
      // Arrange
      const name = 'test';
      const externalId = '0001';

      // Act
      const result = await controller.find(name, externalId);

      // Assert
      expect(service.find).toHaveReturnedTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, externalId);

      expect(result).toEqual(referenceFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should get a reference', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveReturnedTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(referenceFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a reference', async () => {
      // Arrange
      const id = 1;
      const reference: UpdateReferenceDto = { name: 'test', externalId: '0001' };

      // Act
      const result = await controller.update(id, reference);

      // Assert
      expect(service.update).toHaveReturnedTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, reference);

      expect(result).toEqual(referenceFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a reference', async () => {
      // Arrange
      const id = 1;

      // Act
      await controller.remove(id);

      // Assert
      expect(service.remove).toHaveReturnedTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
