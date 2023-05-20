import { Module } from '@nestjs/common';
import { TamanhoService } from './tamanho.service';
import { TamanhoController } from './tamanho.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamanhoEntity } from './entities/tamanho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TamanhoEntity])],
  controllers: [TamanhoController],
  providers: [TamanhoService],
  exports: [TamanhoService],
})
export class TamanhoModule {}
