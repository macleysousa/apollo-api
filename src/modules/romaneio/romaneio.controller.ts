import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

import { ApiComponent } from '../componente/decorator/componente.decorator';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { RomaneioService } from './romaneio.service';

@ApiTags('Romaneios')
@Controller('romaneios')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('ROMFP001', 'Lançamento de romaneios')
export class RomaneioController {
  constructor(private readonly service: RomaneioService) {}

  @Post()
  @ApiResponse({ status: 201, type: RomaneioEntity })
  async create(@Body() createRomaneioDto: CreateRomaneioDto): Promise<RomaneioEntity> {
    return this.service.create(createRomaneioDto);
  }

  @Get()
  @ApiPaginatedResponse(RomaneioEntity)
  async find(): Promise<Pagination<RomaneioEntity>> {
    return this.service.find();
  }
}
