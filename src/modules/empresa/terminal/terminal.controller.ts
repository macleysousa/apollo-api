import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseEmpresaPipe } from 'src/commons/pipes/parseEmpresa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { TerminalEntity } from './entities/terminal.entity';
import { TerminalService } from './terminal.service';

@ApiTags('Empresas Terminais')
@Controller('empresas/:empresaId/terminais')
@ApiBearerAuth()
@ApiComponent('ADMFM006', 'Manutenção de terminais')
export class TerminalController {
  constructor(private readonly service: TerminalService) {}

  @Post()
  @ApiResponse({ status: 201, type: TerminalEntity })
  async create(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Body() createTerminalDto: CreateTerminalDto,
  ): Promise<TerminalEntity> {
    return this.service.create(empresaId, createTerminalDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TerminalEntity] })
  async find(@Param('empresaId', ParseEmpresaPipe) empresaId: number): Promise<TerminalEntity[]> {
    return this.service.find(empresaId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TerminalEntity })
  async findById(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TerminalEntity> {
    return this.service.findById(empresaId, id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: TerminalEntity })
  async update(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTerminalDto: UpdateTerminalDto,
  ): Promise<TerminalEntity> {
    return this.service.update(empresaId, id, updateTerminalDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200 })
  async delete(@Param('empresaId', ParseEmpresaPipe) empresaId: number, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(empresaId, id);
  }
}
