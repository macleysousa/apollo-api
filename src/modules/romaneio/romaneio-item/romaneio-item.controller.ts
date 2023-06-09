import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { RomaneioItemService } from './romaneio-item.service';
import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Romaneios Itens')
@Controller('romaneios/:romaneioId/itens')
@ApiComponent('ROMFP002', 'Lançamento de romaneios itens')
export class RomaneioItemController {
  constructor(private readonly service: RomaneioItemService) {}

  @Post()
  @ApiResponse({ status: 201, type: RomaneioItemEntity })
  async add(@Param('romaneioId') romaneioId: number, @Body() addDto: AddRemoveRomaneioItemDto): Promise<RomaneioItemEntity> {
    return this.service.add(romaneioId, addDto);
  }
}
