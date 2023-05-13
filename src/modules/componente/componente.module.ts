import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponenteService } from './componente.service';
import { ComponenteController } from './componente.controller';
import { ComponenteEntity } from './entities/componente.entity';
import { IsComponentValidConstraint } from './validations/is-component.validation';

@Module({
  imports: [TypeOrmModule.forFeature([ComponenteEntity])],
  controllers: [ComponenteController],
  providers: [ComponenteService, IsComponentValidConstraint],
})
export class ComponentsModule {
  constructor(private componentService: ComponenteService) {
    this.componentService.popular();
  }
}
