import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseRomaneioEmAndamentoPipe } from 'src/commons/pipes/parseRomaneio.pipe';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemService } from './romaneio-item.service';

import { RomaneioItemView } from './views/romaneio-item.view';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Romaneios Itens')
@Controller('romaneios/:romaneioId/itens')
@ApiComponent('ROMFP002', 'Lançamento de romaneios - itens')
export class RomaneioItemController {
  constructor(private readonly service: RomaneioItemService) {}

  @Post()
  @ApiResponse({ status: 201 })
  async add(@Param('romaneioId') romaneioId: number, @Body() addDto: AddRemoveRomaneioItemDto): Promise<void> {
    return this.service.add(romaneioId, addDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [RomaneioItemView] })
  async find(@Param('romaneioId') romaneioId: number): Promise<RomaneioItemView[]> {
    return this.service.find(romaneioId);
  }

  @Delete()
  @ApiResponse({ status: 201 })
  async remove(
    @Param('romaneioId', ParseRomaneioEmAndamentoPipe) romaneioId: number,
    @Body() { produtoId, quantidade }: AddRemoveRomaneioItemDto
  ): Promise<void> {
    await this.service.remove(romaneioId, produtoId, quantidade);
  }
}
