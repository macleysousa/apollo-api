import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ContextService } from 'src/context/context.service';

import { UsuarioEntity } from './entities/usuario.entity';

@ApiTags('Perfil')
@Controller('perfil')
@ApiBearerAuth()
export class PerfilController {
  constructor(private context: ContextService) {}

  @Get()
  @ApiResponse({ type: UsuarioEntity, status: 200 })
  async find(): Promise<UsuarioEntity> {
    return this.context.usuario();
  }
}
