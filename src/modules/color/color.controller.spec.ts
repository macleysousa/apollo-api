import { Test, TestingModule } from '@nestjs/testing';
import { colorFakeRepository } from 'src/base-fake/color';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

describe('ColorController', () => {
    let controller: ColorController;
    let service: ColorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ColorController],
            providers: [
                {
                    provide: ColorService,
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

        controller = module.get<ColorController>(ColorController);
        service = module.get<ColorService>(ColorService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('/ (POST)', () => {
        it('should create a new color', async () => {
            //Arrange
            const color: CreateColorDto = { id: 1, name: 'RED', active: true };

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
            const color: UpdateColorDto = { name: 'white', active: false };

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
