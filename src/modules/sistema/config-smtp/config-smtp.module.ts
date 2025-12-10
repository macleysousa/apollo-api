import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigSmtpController } from './config-smtp.controller';
import { ConfigSmtpService } from './config-smtp.service';
import { ConfigSmtpEntity } from './entities/config-smtp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigSmtpEntity])],
  controllers: [ConfigSmtpController],
  providers: [ConfigSmtpService],
  exports: [ConfigSmtpService],
})
export class ConfigSmtpModule {
  static forRoot() {
    return {
      global: true,
      module: this,
    };
  }
}
