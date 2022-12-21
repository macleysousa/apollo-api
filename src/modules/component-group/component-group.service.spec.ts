import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { componentGroupFakeRepository } from 'src/base-fake/component-group';
import { ILike, Repository } from 'typeorm';
import { ComponentGroupService } from './component-group.service';
import { CreateComponentGroupDto } from './dto/create-component-group.dto';
import { UpdateComponentGroupDto } from './dto/update-component-group.dto';
import { ComponentGroupEntity } from './entities/component-group.entity';

describe('ComponentGroupService', () => {
    let service: ComponentGroupService;
    let repository: Repository<ComponentGroupEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ComponentGroupService,
                {
                    provide: getRepositoryToken(ComponentGroupEntity),
                    useValue: {
                        save: jest.fn().mockResolvedValue(componentGroupFakeRepository.findOne()),
                        find: jest.fn().mockReturnValue(componentGroupFakeRepository.find()),
                        findOne: jest.fn().mockReturnValue(componentGroupFakeRepository.findOne()),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ComponentGroupService>(ComponentGroupService);
        repository = module.get<Repository<ComponentGroupEntity>>(getRepositoryToken(ComponentGroupEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a component group entity with success', async () => {
            // Arrange
            const componentGroup: CreateComponentGroupDto = { name: 'admin' };

            // Act
            const response = await service.create(componentGroup);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({ name: componentGroup.name });

            expect(response).toEqual(componentGroupFakeRepository.findOne());
        });
    });

    describe('find', () => {
        it('should return a list groups with success', async () => {
            // Arrange
            const name = 'admin';

            // Act
            const response = await service.find(name);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { name: ILike(`%${name ?? ''}%`) } });

            expect(response).toEqual(componentGroupFakeRepository.find());
        });

        it('should return a list groups with success not pass filter', async () => {
            // Arrange
            const name = undefined;

            // Act
            const response = await service.find();

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { name: ILike(`%${name ?? ''}%`) } });

            expect(response).toEqual(componentGroupFakeRepository.find());
        });
    });

    describe('findById', () => {
        it('should return a group with success', async () => {
            // Arrange
            const id = 1;

            // Act
            const response = await service.findById(id);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

            expect(response).toEqual(componentGroupFakeRepository.findOne());
        });
    });

    describe('update', () => {
        it('should update a group with failed error *Group with id ${id} not found*', async () => {
            // Arrange
            const id = 1;
            const componentGroup: UpdateComponentGroupDto = { name: 'admin' };
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

            // Act

            // Assert
            expect(service.update(id, componentGroup)).rejects.toEqual(new Error(`Group with id ${id} not found`));
            expect(repository.save).toHaveBeenCalledTimes(0);
        });

        it('should update a group with success', async () => {
            // Arrange
            const id = 1;
            const componentGroup: UpdateComponentGroupDto = { name: 'admin' };
            const group = { ...componentGroupFakeRepository.findOne(), ...componentGroup };

            // Act
            const response = await service.update(id, componentGroup);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(group);

            expect(response).toEqual(group);
        });
    });

    describe('remove', () => {
        it('should remove a group with failed error *Group with id ${id} not found*', async () => {
            // Arrange
            const id = 1;
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

            // Act

            // Assert
            expect(service.remove(id)).rejects.toEqual(new Error(`Group with id ${id} not found`));
            expect(repository.save).toHaveBeenCalledTimes(0);
        });

        it('should remove a group with success', async () => {
            // Arrange
            const id = 1;

            // Act
            await service.remove(id);

            // Assert
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith({ id });
        });
    });
});
