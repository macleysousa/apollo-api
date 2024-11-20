import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponenteGrupoItemController } from './componente-grupo-item.controller';
import { ComponenteGrupoItemService } from './componente-grupo-item.service';
import { ComponenteGrupoItemEntity } from './entities/componente-grupo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponenteGrupoItemEntity])],
  controllers: [ComponenteGrupoItemController],
  providers: [ComponenteGrupoItemService],
})
export class ComponentGroupItemModule {}
