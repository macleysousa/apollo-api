import { Module } from '@nestjs/common';

import { ConfigSmtpModule } from './config-smtp/config-smtp.module';

@Module({
  imports: [ConfigSmtpModule.forRoot()],
  controllers: [],
  providers: [],
})
export class SistemaModule {
  static forRoot() {
    return {
      global: true,
      module: this,
    };
  }
}
