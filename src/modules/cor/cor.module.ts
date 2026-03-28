import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorConstraint } from 'src/commons/validations/is-color.validation';

import { CorController } from './cor.controller';
import { CorService } from './cor.service';
import { CorEntity } from './entities/cor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorEntity])],
  controllers: [CorController],
  providers: [CorService, ColorConstraint],
  exports: [CorService],
})
export class CorModule implements OnModuleInit {
  constructor(private readonly corService: CorService) {}

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }

  async onModuleInit(): Promise<void> {
    await this.corService.popularBaseInicialSeHabilitada();
  }
}
