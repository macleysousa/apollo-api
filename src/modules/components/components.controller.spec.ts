import { Test, TestingModule } from '@nestjs/testing';
import { componentFakeRepository } from 'src/base-fake/component';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';

describe('ComponentsController', () => {
    let controller: ComponentsController;
    let componentsService: ComponentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ComponentsController],
            providers: [
                {
                    provide: ComponentsService,
                    useValue: {
                        find: jest.fn().mockResolvedValue(componentFakeRepository.find()),
                        findById: jest.fn().mockResolvedValue(componentFakeRepository.findOne()),
                    },
                },
            ],
        }).compile();

        controller = module.get<ComponentsController>(ComponentsController);
        componentsService = module.get<ComponentsService>(ComponentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(componentsService).toBeDefined();
    });

    describe('/ (GET)', () => {
        it('should return a list of component successfully', async () => {
            // Arrange
            const filter = 'filter';
            const blocked = true;

            // Act
            const response = await controller.find(filter, blocked);

            // Assert
            expect(componentsService.find).toHaveBeenCalledTimes(1);
            expect(componentsService.find).toHaveBeenCalledWith(filter, blocked);

            expect(response).toEqual(componentFakeRepository.find());
        });
    });

    describe('/:id (GET)', () => {
        it('should return a component entity successfully', async () => {
            // Arrange
            const id = 'ADMFM001';

            // Act
            const response = await controller.findById(id);

            // Assert
            expect(componentsService.findById).toHaveBeenCalledTimes(1);
            expect(componentsService.findById).toHaveBeenCalledWith(id);

            expect(response).toEqual(componentFakeRepository.findOne());
        });
    });
});
