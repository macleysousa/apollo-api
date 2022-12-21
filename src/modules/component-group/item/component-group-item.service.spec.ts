import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { componentGroupItemFakeRepository } from 'src/base-fake/component-group-item';
import { Repository } from 'typeorm';

import { ComponentGroupItemService } from './component-group-item.service';
import { CreateComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';

describe('ComponentGroupItemService', () => {
    let service: ComponentGroupItemService;
    let repository: Repository<ComponentGroupItemEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ComponentGroupItemService,
                {
                    provide: getRepositoryToken(ComponentGroupItemEntity),
                    useValue: {
                        upsert: jest.fn(),
                        find: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.find()),
                        findOne: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.findOne()),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ComponentGroupItemService>(ComponentGroupItemService);
        repository = module.get<Repository<ComponentGroupItemEntity>>(getRepositoryToken(ComponentGroupItemEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('add', () => {
        it('should add component group item', async () => {
            // Arrage
            const groupId = 1;
            const component: CreateComponentGroupItemDto = { componentId: 'ADMFM002' };

            // Act
            const response = await service.add(groupId, component);

            // Assert
            expect(repository.upsert).toHaveBeenCalledTimes(1);
            expect(repository.upsert).toHaveBeenCalledWith({ groupId, ...component }, { conflictPaths: ['groupId', 'componentId'] });

            expect(response).toEqual(componentGroupItemFakeRepository.find());
        });
    });

    describe('findByGroup', () => {
        it('should find component group item by group id', async () => {
            // Arrage
            const groupId = 1;

            // Act
            const response = await service.findByGroup(groupId);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { groupId }, relations: ['component'] });

            expect(response).toEqual(componentGroupItemFakeRepository.find());
        });
    });

    describe('findByComponent', () => {
        it('should find component group item by component id', async () => {
            // Arrage
            const groupId = 1;
            const componentId = 'ADMFM002';

            // Act
            const response = await service.findByComponent(groupId, componentId);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { groupId, componentId }, relations: ['component'] });

            expect(response).toEqual(componentGroupItemFakeRepository.findOne());
        });
    });

    describe('remove', () => {
        it('should remove component group item', async () => {
            // Arrage
            const groupId = 1;
            const componentId = 'ADMFM002';

            // Act
            await service.remove(groupId, componentId);

            // Assert
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith({ groupId, componentId });
        });
    });
});
