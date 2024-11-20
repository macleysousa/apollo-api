import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponenteController } from './componente.controller';
import { ComponenteService } from './componente.service';
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

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
