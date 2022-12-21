import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateComponentGroupDto } from './dto/create-component-group.dto';
import { UpdateComponentGroupDto } from './dto/update-component-group.dto';
import { ComponentGroupEntity } from './entities/component-group.entity';

@Injectable()
export class ComponentGroupService {
    constructor(
        @InjectRepository(ComponentGroupEntity)
        private repository: Repository<ComponentGroupEntity>
    ) {}

    async create({ name }: CreateComponentGroupDto): Promise<ComponentGroupEntity> {
        const group = await this.repository.save({ name });
        return this.findById(group.id);
    }

    async find(name?: string): Promise<ComponentGroupEntity[]> {
        return this.repository.find({ where: { name: ILike(`%${name ?? ''}%`) } });
    }

    async findById(id: number): Promise<ComponentGroupEntity> {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: number, { name }: UpdateComponentGroupDto): Promise<ComponentGroupEntity> {
        const group = await this.findById(id);

        if (!group) {
            throw new BadRequestException(`Group with id ${id} not found`);
        }

        if (name) {
            group.name = name;
        }

        await this.repository.save(group);

        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        const group = await this.findById(id);

        if (!group) {
            throw new BadRequestException(`Group with id ${id} not found`);
        }

        await this.repository.delete({ id });
    }
}
