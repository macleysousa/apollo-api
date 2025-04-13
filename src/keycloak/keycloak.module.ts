import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';

import { KeycloakService } from './keycloak.service';

@Module({
  imports: [HttpModule],
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
