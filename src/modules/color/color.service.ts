import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorEntity } from './entities/color.entity';

@Injectable()
export class ColorService {
    constructor(
        @InjectRepository(ColorEntity)
        private colorRepository: Repository<ColorEntity>
    ) {}

    async create(createColorDto: CreateColorDto): Promise<ColorEntity> {
        return this.colorRepository.save(createColorDto);
    }

    async find(name?: string, active?: boolean | unknown): Promise<ColorEntity[]> {
        console.log(active);
        return this.colorRepository.find({
            where: { name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
        });
    }

    async findById(id: number): Promise<ColorEntity> {
        return this.colorRepository.findOne({ where: { id } });
    }

    async update(id: number, { name, active }: UpdateColorDto): Promise<ColorEntity> {
        const color = await this.findById(id);

        if (name) {
            color.name = name;
        }

        if (active != undefined) {
            color.active = active;
        }

        return this.colorRepository.save(color);
    }

    async remove(id: number): Promise<void> {
        await this.colorRepository.delete({ id });
    }
}
