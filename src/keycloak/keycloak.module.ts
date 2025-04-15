import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';

import { KeycloakService } from './keycloak.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
