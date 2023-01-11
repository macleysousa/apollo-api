import { Test, TestingModule } from '@nestjs/testing';
import { sizeFakeRepository } from 'src/base-fake/size';
import { CreateSizeDto } from './dto/create-size.dto';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';

describe('SizeController', () => {
    let controller: SizeController;
    let service: SizeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SizeController],
            providers: [
                {
                    provide: SizeService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(sizeFakeRepository.find()),
                        findById: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        update: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SizeController>(SizeController);
        service = module.get<SizeService>(SizeService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('/ (POST)', () => {
        it('should create a new size', async () => {
            // Arrange
            const size: CreateSizeDto = { id: 1, name: 'P', active: true };

            // Act
            const result = await controller.create(size);

            // Assert
            expect(service.create).toHaveBeenCalledTimes(1);
            expect(service.create).toHaveBeenCalledWith(size);

            expect(result).toEqual(sizeFakeRepository.findOne());
        });
    });

    describe('/ (GET)', () => {
        it('should return a list of sizes', async () => {
            // Arrange
            const name = undefined;
            const active = undefined;

            // Act
            const result = await controller.find(name, active);

            // Assert
            expect(service.find).toHaveBeenCalledTimes(1);
            expect(service.find).toHaveBeenCalledWith(name, active);

            expect(result).toEqual(sizeFakeRepository.find());
        });
    });

    describe('/:id (GET)', () => {
        it('should return a size', async () => {
            // Arrange
            const id = 1;

            // Act
            const result = await controller.findById(id);

            // Assert
            expect(service.findById).toHaveBeenCalledTimes(1);
            expect(service.findById).toHaveBeenCalledWith(id);

            expect(result).toEqual(sizeFakeRepository.findOne());
        });
    });

    describe('/:id (PUT)', () => {
        it('should update a size', async () => {
            // Arrange
            const id = 1;
            const size: CreateSizeDto = { id: 1, name: 'P', active: true };

            // Act
            const result = await controller.update(id, size);

            // Assert
            expect(service.update).toHaveBeenCalledTimes(1);
            expect(service.update).toHaveBeenCalledWith(id, size);

            expect(result).toEqual(sizeFakeRepository.findOne());
        });
    });

    describe('/:id (DELETE)', () => {
        it('should delete a size', async () => {
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
