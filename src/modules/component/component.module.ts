import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentsService } from './component.service';
import { ComponentsController } from './component.controller';
import { ComponentEntity } from './entities/component.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ComponentEntity])],
    controllers: [ComponentsController],
    providers: [ComponentsService],
})
export class ComponentsModule {}
