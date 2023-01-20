import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { brandFakeRepository } from 'src/base-fake/brand';
import { ILike, Repository } from 'typeorm';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from './entities/brand.entity';

describe('BrandService', () => {
  let service: BrandService;
  let repository: Repository<BrandEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: getRepositoryToken(BrandEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(brandFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    repository = module.get<Repository<BrandEntity>>(getRepositoryToken(BrandEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new brand', async () => {
      // Arrange
      const category: CreateBrandDto = { name: 'Name', active: true };
      jest.spyOn(service, 'findByName').mockResolvedValue(undefined);

      // Act
      const result = await service.create(category);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(category);

      expect(result).toEqual(brandFakeRepository.findOne());
    });

    it('should create a new brand with error *Brand with name ${brand.name} already exists*', async () => {
      // Arrange
      const brand: CreateBrandDto = { name: 'Name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(brand)).rejects.toEqual(new BadRequestException(`Brand with name ${brand.name} already exists`));
    });
  });

  describe('find', () => {
    it('should find all brands with no filter', async () => {
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

      expect(result).toEqual(brandFakeRepository.find());
    });

    it('should find all brands with filter', async () => {
      // Arrange
      const name = 'Name';
      const active = true;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`), active },
      });

      expect(result).toEqual(brandFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a brand by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('findByName', () => {
    it('should find a brand by name', async () => {
      // Arrange
      const name = 'Name';

      // Act
      const result = await service.findByName(name);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name } });

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a brand', async () => {
      // Arrange
      const id = 1;
      const brand: UpdateBrandDto = { name: 'Name', active: true };

      // Act
      const result = await service.update(id, brand);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, brand);

      expect(result).toEqual(brandFakeRepository.findOne());
    });

    it('should update a brand with error *Brand with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      const brand: UpdateBrandDto = { name: 'name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, brand)).rejects.toEqual(new BadRequestException(`Brand with id ${id} not found`));
    });

    it('should update a brand with error *Brand with this name ${brand.name} already exists*', async () => {
      // Arrange
      const id = 2;
      const brand: UpdateBrandDto = { name: 'name', active: true };

      // Act

      // Assert
      expect(service.update(id, brand)).rejects.toEqual(new BadRequestException(`Brand with name ${brand.name} already exists`));
    });
  });

  describe('remove', () => {
    it('should remove a brand', async () => {
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
