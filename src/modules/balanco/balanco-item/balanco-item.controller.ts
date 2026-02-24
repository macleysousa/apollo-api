import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { BalancoItemService } from './balanco-item.service';
import { AddRemoveBalancoItemDto } from './dto/add-remove-balanco-item.dto';
import { BalancoItemEntity } from './entities/balanco-item.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Balanços Itens')
@Controller('balancos/:balancoId/itens')
@ApiComponent('BALFP002', 'Lançamento de balanços - itens')
export class BalancoItemController {
  constructor(private readonly service: BalancoItemService) {}

  @Post()
  @ApiResponse({ status: 201 })
  async add(@Param('balancoId', ParseIntPipe) balancoId: number, @Body() addDto: AddRemoveBalancoItemDto): Promise<void> {
    return this.service.add(balancoId, addDto);
  }

  @Put()
  @ApiResponse({ status: 201 })
  @ApiBody({ type: [AddRemoveBalancoItemDto] })
  async addMultiple(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Body() addDtos: AddRemoveBalancoItemDto[],
  ): Promise<void> {
    for await (const addDto of addDtos) {
      await this.service.add(balancoId, addDto);
    }
  }

  @Get()
  @ApiResponse({ status: 200, type: [BalancoItemEntity] })
  async find(@Param('balancoId', ParseIntPipe) balancoId: number): Promise<BalancoItemEntity[]> {
    return this.service.findByBalancoId(balancoId);
  }

  @Delete(':produtoId')
  @ApiResponse({ status: 200 })
  async remove(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('produtoId', ParseIntPipe) produtoId: number,
  ): Promise<void> {
    return this.service.remove(balancoId, produtoId);
  }
}
