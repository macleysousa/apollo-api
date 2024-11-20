import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponenteGrupoController } from './componente-grupo.controller';
import { ComponenteGrupoService } from './componente-grupo.service';
import { ComponenteGrupoEntity } from './entities/componente-grupo.entity';
import { ComponentGroupItemModule } from './item/componente-grupo-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([ComponenteGrupoEntity]), ComponentGroupItemModule],
  controllers: [ComponenteGrupoController],
  providers: [ComponenteGrupoService],
})
export class ComponentGroupModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
