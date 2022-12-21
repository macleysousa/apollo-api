import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';

@Injectable()
export class ComponentGroupItemService {
    constructor(
        @InjectRepository(ComponentGroupItemEntity)
        private repository: Repository<ComponentGroupItemEntity>
    ) {}

    async add(groupId: number, { componentId }: CreateComponentGroupItemDto): Promise<ComponentGroupItemEntity[]> {
        await this.repository.upsert({ groupId, componentId }, { conflictPaths: ['groupId', 'componentId'] });
        return this.findByGroup(groupId);
    }

    async findByGroup(groupId: number, relations = ['component']): Promise<ComponentGroupItemEntity[]> {
        return this.repository.find({ where: { groupId }, relations });
    }

    async findByComponent(groupId: number, componentId: string, relations = ['component']): Promise<ComponentGroupItemEntity> {
        return this.repository.findOne({ where: { groupId, componentId }, relations });
    }

    async remove(groupId: number, componentId: string): Promise<void> {
        await this.repository.delete({ groupId, componentId });
    }
}
