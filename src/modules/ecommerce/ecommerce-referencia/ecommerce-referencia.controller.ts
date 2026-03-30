import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Pagination } from 'src/commons/pagination/dto/paginated.dto';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

import { CreateEcommerceReferenciaDto } from './dto/create-ecommerce-referencia.dto';
import { UpdateEcommerceReferenciaDto } from './dto/update-ecommerce-referencia.dto';
import { EcommerceReferenciaService } from './ecommerce-referencia.service';
import { EcommerceReferenciaEntity } from './entities/ecommerce-referencia.entity';
import { EcommerceReferenciaFilters } from './filters/ecommerce-referencia.filters';
import { EcommerceReferenciaView } from './view/ecommerce-referencia.view';

@ApiBearerAuth()
@ApiTags('E-commerce - Referências')
@Controller('e-commerce/:ecommerceId/referencias')
@ApiComponent('ECOFM002', 'Manutenção de e-commerce (referências)')
export class EcommerceReferenciaController {
  constructor(private readonly service: EcommerceReferenciaService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Referência criada com sucesso.', type: EcommerceReferenciaEntity })
  async create(
    @Param('ecommerceId', ParseIntPipe) ecommerceId: number,
    @Body() dto: CreateEcommerceReferenciaDto,
  ): Promise<EcommerceReferenciaEntity> {
    return this.service.create(ecommerceId, dto);
  }

  @Get()
  @ApiPaginatedResponse(EcommerceReferenciaView)
  async findAll(
    @Param('ecommerceId', ParseIntPipe) ecommerceId: number,
    @Query() filters: EcommerceReferenciaFilters,
  ): Promise<Pagination<EcommerceReferenciaView>> {
    return this.service.findAll(ecommerceId, filters);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Referência encontrada.', type: EcommerceReferenciaView })
  async findOne(
    @Param('ecommerceId', ParseIntPipe) ecommerceId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EcommerceReferenciaView> {
    return this.service.findOne(ecommerceId, id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Referência atualizada com sucesso.', type: EcommerceReferenciaEntity })
  async update(
    @Param('ecommerceId', ParseIntPipe) ecommerceId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEcommerceReferenciaDto,
  ): Promise<EcommerceReferenciaEntity> {
    return this.service.update(ecommerceId, id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Referência removida com sucesso.' })
  async remove(@Param('ecommerceId', ParseIntPipe) ecommerceId: number, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(ecommerceId, id);
  }
}
