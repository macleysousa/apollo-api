import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { sizeFakeRepository } from 'src/base-fake/size';
import { ILike, Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizeEntity } from './entities/size.entity';
import { SizeService } from './size.service';

describe('SizeService', () => {
    let service: SizeService;
    let repository: Repository<SizeEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SizeService,
                {
                    provide: getRepositoryToken(SizeEntity),
                    useValue: {
                        create: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(sizeFakeRepository.find()),
                        findOne: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        save: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SizeService>(SizeService);
        repository = module.get<Repository<SizeEntity>>(getRepositoryToken(SizeEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a new size', async () => {
            // Arrange
            const size: CreateSizeDto = { id: 1, name: 'P', active: true };

            // Act
            const result = await service.create(size);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(size);

            expect(result).toEqual(sizeFakeRepository.findOne());
        });

        it('should create a new size with error *Size with this id ${size.id} already exists*', async () => {
            // Arrange
            const size: CreateSizeDto = { id: 1, name: 'M', active: true };

            // Act

            // Assert
            expect(service.create(size)).rejects.toEqual(new BadRequestException(`Size with this id ${size.id} already exists`));
        });

        it('should create a new size with error *Size with this id ${size.name} already exists*', async () => {
            // Arrange
            const size: CreateSizeDto = { id: 2, name: 'M', active: true };
            jest.spyOn(service, 'findById').mockResolvedValue(undefined);

            // Act

            // Assert
            expect(service.create(size)).rejects.toEqual(new BadRequestException(`Size with this name ${size.name} already exists`));
        });
    });

    describe('find', () => {
        it('should find all size with no filter', async () => {
            // Arrange
            const name = undefined;
            const active = undefined;

            // Act
            const result = await service.find(name, active);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                where: { name: ILike(`%${''}%`), active: undefined },
            });

            expect(result).toEqual(sizeFakeRepository.find());
        });

        it('should find all size with filter', async () => {
            // Arrange
            const name = 'M';
            const active = true;

            // Act
            const result = await service.find(name, active);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                where: { name: ILike(`%${name}%`), active },
            });

            expect(result).toEqual(sizeFakeRepository.find());
        });
    });

    describe('findById', () => {
        it('should find a size by id', async () => {
            // Arrange
            const id = 1;

            // Act
            const result = await service.findById(id);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

            expect(result).toEqual(sizeFakeRepository.findOne());
        });
    });

    describe('findByName', () => {
        it('should find a size by name', async () => {
            // Arrange
            const name = 'M';

            // Act
            const result = await service.findByName(name);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { name } });

            expect(result).toEqual(sizeFakeRepository.findOne());
        });
    });

    describe('update', () => {
        it('should update a size', async () => {
            // Arrange
            const id = 1;
            const size: CreateSizeDto = { id: 1, name: 'P', active: true };

            // Act
            const result = await service.update(id, size);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({ ...sizeFakeRepository.findOne(), ...size });

            expect(result).toEqual(sizeFakeRepository.findOne());
        });

        it('should update a size with error *Size with this id ${size.id} does not exist*', async () => {
            // Arrange
            const id = 1;
            const size: UpdateSizeDto = { name: 'M', active: true };
            jest.spyOn(service, 'findById').mockResolvedValue(undefined);

            // Act

            // Assert
            expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Size with this id ${id} does not exist`));
        });

        it('should update a size with error *Size with this name ${size.name} already exists*', async () => {
            // Arrange
            const id = 2;
            const size: UpdateSizeDto = { name: 'M', active: true };
            //  jest.spyOn(service, '').mockResolvedValue(sizeFakeRepository.findOne());

            // Act

            // Assert
            expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Size with this name ${size.name} already exists`));
        });
    });

    describe('remove', () => {
        it('should remove a size', async () => {
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
