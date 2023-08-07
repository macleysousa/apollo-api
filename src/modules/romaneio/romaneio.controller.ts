import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { ApiComponent } from '../componente/decorator/componente.decorator';
import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioService } from './romaneio.service';
import { RomaneioView } from './views/romaneio.view';

@ApiTags('Romaneios')
@Controller('romaneios')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('ROMFP001', 'Lançamento de romaneios')
export class RomaneioController {
  constructor(private readonly service: RomaneioService) {}

  @Post()
  @ApiResponse({ status: 201, type: RomaneioView })
  async create(@Body() createRomaneioDto: CreateRomaneioDto): Promise<RomaneioView> {
    return this.service.create(createRomaneioDto);
  }

  @Get()
  @ApiPaginatedResponse(RomaneioView)
  async find(): Promise<Pagination<RomaneioView>> {
    return this.service.find();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: RomaneioView })
  async findOne(@CurrentBranch() empresa: EmpresaEntity, @Param('id', ParseIntPipe) id: number): Promise<RomaneioView> {
    return this.service.findById(empresa.id, id);
  }

  @Put(':id/observacao')
  @ApiResponse({ status: 200, type: RomaneioView })
  async observacao(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() observacao: OperacaoRomaneioDto
  ): Promise<RomaneioView> {
    return this.service.observacao(empresa.id, id, observacao);
  }
}
