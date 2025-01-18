import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaMediaController } from './referencia-media.controller';
import { ReferenciaMediaService } from './referencia-media.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenciaMediaEntity])],
  controllers: [ReferenciaMediaController],
  providers: [ReferenciaMediaService],
  exports: [ReferenciaMediaService],
})
export class ReferenciaMediaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
