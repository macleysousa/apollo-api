import { Controller, Get, Post, Body, Put, Param, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

@ApiTags('Produtos')
@Controller('produtos')
@ApiBearerAuth()
@ApiComponent('PRDFM008', 'Manutenção de produto')
export class ProdutoController {
  constructor(private readonly productService: ProdutoService) {}

  @Post()
  @ApiResponse({ status: 201, type: ProdutoEntity })
  async create(@Body() createProductDto: CreateProdutoDto): Promise<ProdutoEntity> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiPaginatedResponse(ProdutoEntity)
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Query('searchTerm') searchTerm: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number
  ): Promise<Pagination<ProdutoEntity>> {
    return this.productService.find(searchTerm, page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProdutoEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProdutoEntity> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: ProdutoEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProdutoDto): Promise<ProdutoEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
