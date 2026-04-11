import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaContagemController } from './contagem.controller';
import { CaixaContagemService } from './contagem.service';
import { CaixaContagemEntity } from './entities/contagem.entity';
import { CaixaContagemItemEntity } from './entities/contagem-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaixaContagemEntity, CaixaContagemItemEntity])],
  controllers: [CaixaContagemController],
  providers: [CaixaContagemService],
  exports: [CaixaContagemService],
})
export class ContagemModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
