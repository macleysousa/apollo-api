import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentEntity } from './entities/component.entity';

@Injectable()
export class ComponentsService {
    constructor(
        @InjectRepository(ComponentEntity)
        private componentRepository: Repository<ComponentEntity>
    ) {}

    async create(createComponentDto: CreateComponentDto): Promise<ComponentEntity> {
        return;
    }

    async findAll(): Promise<ComponentEntity[]> {
        return;
    }

    async findOne(id: number): Promise<ComponentEntity> {
        return;
    }

    async update(id: number, updateComponentDto: UpdateComponentDto): Promise<ComponentEntity> {
        return;
    }

    async remove(id: number): Promise<ComponentEntity> {
        return;
    }
}
