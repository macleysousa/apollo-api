import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizeEntity } from './entities/size.entity';

@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(SizeEntity)
        private readonly sizeRepository: Repository<SizeEntity>
    ) {}

    async create(createSizeDto: CreateSizeDto): Promise<SizeEntity> {
        const sizeById = await this.findById(createSizeDto.id);
        if (sizeById && sizeById.name != createSizeDto.name) {
            throw new BadRequestException(`Size with this id ${createSizeDto.id} already exists`);
        }

        const sizeByName = await this.findByName(createSizeDto.name);
        if (sizeByName && sizeByName.name != createSizeDto.name) {
            throw new BadRequestException(`Size with this name ${createSizeDto.name} already exists`);
        }

        const size = await this.sizeRepository.save(createSizeDto);

        return this.findById(size.id);
    }

    async find(name?: string, active?: boolean | unknown): Promise<SizeEntity[]> {
        return this.sizeRepository.find({
            where: { name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
        });
    }

    async findById(id: number): Promise<SizeEntity> {
        return this.sizeRepository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<SizeEntity> {
        return this.sizeRepository.findOne({ where: { name } });
    }

    async update(id: number, updateSizeDto: UpdateSizeDto): Promise<SizeEntity> {
        const sizeById = await this.findById(id);
        if (!sizeById) {
            throw new BadRequestException(`Size with this id ${id} does not exist`);
        }

        const sizeByName = await this.findByName(updateSizeDto.name);
        if (sizeByName && sizeByName.id != id) {
            throw new BadRequestException(`Size with this name ${updateSizeDto.name} already exists`);
        }

        await this.sizeRepository.save({ ...sizeById, ...updateSizeDto });

        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        await this.sizeRepository.delete({ id });
    }
}
