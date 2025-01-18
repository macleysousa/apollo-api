import { DynamicModule, Module } from '@nestjs/common';

import { MediaR2Constraint } from 'src/commons/validations/is-media-r2.validation';

import { StorageService } from './storage.service';

@Module({
  providers: [StorageService, MediaR2Constraint],
  exports: [StorageService],
})
export class StorageModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
