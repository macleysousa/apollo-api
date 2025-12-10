import { Module } from '@nestjs/common';

import { EmailManagerService } from './email-manager.service';

@Module({
  providers: [EmailManagerService],
  exports: [EmailManagerService],
})
export class EmailManagerModule {
  static forRoot() {
    return {
      global: true,
      module: this,
    };
  }
}
