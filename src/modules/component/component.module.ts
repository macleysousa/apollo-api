import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentService } from './component.service';
import { ComponentsController } from './component.controller';
import { ComponentEntity } from './entities/component.entity';
import { IsComponentValidConstraint } from './validations/is-component.validation';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentEntity])],
  controllers: [ComponentsController],
  providers: [ComponentService, IsComponentValidConstraint],
})
export class ComponentsModule {
  constructor(private componentsService: ComponentService) {
    this.componentsService.popular();
  }
}
