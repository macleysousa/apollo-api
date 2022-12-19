import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { ComponentEntity } from './entities/component.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ComponentEntity])],
    controllers: [ComponentsController],
    providers: [ComponentsService],
})
export class ComponentsModule {}
