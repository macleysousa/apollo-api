import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Pagination } from 'src/commons/pagination/dto/paginated.dto';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { CreateEcommerceReferenciaDto } from './dto/create-ecommerce-referencia.dto';
import { UpdateEcommerceReferenciaDto } from './dto/update-ecommerce-referencia.dto';
import { EcommerceReferenciaService } from './ecommerce-referencia.service';
import { EcommerceReferenciaEntity } from './entities/ecommerce-referencia.entity';
import { EcommerceReferenciaFilters } from './filters/ecommerce-referencia.filters';
import { EcommerceReferenciaView } from './view/ecommerce-referencia.view';

@ApiBearerAuth()
@ApiTags('E-commerce')
@Controller('e-commerce/referencias')
@ApiComponent('ECOFM002', 'Manutenção de e-commerce (referências)')
export class EcommerceReferenciaController {
  constructor(private readonly service: EcommerceReferenciaService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Referência criada com sucesso.', type: EcommerceReferenciaEntity })
  async create(@Body() dto: CreateEcommerceReferenciaDto): Promise<EcommerceReferenciaEntity> {
    return this.service.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(EcommerceReferenciaView)
  async findAll(@Query() filters: EcommerceReferenciaFilters): Promise<Pagination<EcommerceReferenciaView>> {
    return this.service.findAll(filters);
  }

  @Get(':empresaId/empresa')
  @ApiPaginatedResponse(EcommerceReferenciaView)
  @IsPublic()
  async findEmpresa(
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Query() filters: EcommerceReferenciaFilters,
  ): Promise<Pagination<EcommerceReferenciaView>> {
    return this.service.findEmpresa(empresaId, filters);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Referência encontrada.', type: EcommerceReferenciaView })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EcommerceReferenciaView> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Referência atualizada com sucesso.', type: EcommerceReferenciaEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEcommerceReferenciaDto,
  ): Promise<EcommerceReferenciaEntity> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Referência removida com sucesso.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
