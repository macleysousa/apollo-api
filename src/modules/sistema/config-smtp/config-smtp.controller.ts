import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { ConfigSmtpService } from './config-smtp.service';
import { CreateConfigSmtpDto } from './dto/create-config-smtp.dto';
import { UpdateConfigSmtpDto } from './dto/update-config-smtp.dto';
import { ConfigSmtpEntity } from './entities/config-smtp.entity';

@ApiBearerAuth()
@ApiTags('Sistema - Configuração SMTP')
@ApiComponent('SYSFM001', 'Manutenção Configuração SMTP')
@Controller('sistema/config-smtp')
export class ConfigSmtpController {
  constructor(private readonly configSmtpService: ConfigSmtpService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Configuração SMTP criada/atualizada com sucesso.', type: ConfigSmtpEntity })
  async create(@Body() createConfigSmtpDto: CreateConfigSmtpDto): Promise<ConfigSmtpEntity> {
    return this.configSmtpService.create(createConfigSmtpDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Configuração SMTP obtida com sucesso.', type: ConfigSmtpEntity })
  async find(): Promise<ConfigSmtpEntity> {
    return this.configSmtpService.find();
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Configuração SMTP atualizada com sucesso.', type: ConfigSmtpEntity })
  async update(@Body() updateConfigSmtpDto: UpdateConfigSmtpDto): Promise<ConfigSmtpEntity> {
    return this.configSmtpService.put(updateConfigSmtpDto);
  }

  @Get('verificar-conexao')
  @ApiResponse({ status: 200, description: 'Conexão SMTP validada com sucesso.' })
  async validateConnection(): Promise<boolean> {
    return this.configSmtpService.validateConnection();
  }
}
