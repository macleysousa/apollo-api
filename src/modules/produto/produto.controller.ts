import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ParseArrayPipe } from 'src/commons/pipes/parseArrayPipe.pipe';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ImportProdutoDto } from './dto/import-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';
import { ProdutoService } from './produto.service';

@ApiTags('Produtos')
@Controller('produtos')
@ApiBearerAuth()
@ApiComponent('PRDFM008', 'Manutenção de produto')
export class ProdutoController {
  constructor(private readonly service: ProdutoService) {}

  @Post()
  @ApiResponse({ status: 201, type: ProdutoEntity })
  async create(@Body() createProductDto: CreateProdutoDto): Promise<ProdutoEntity> {
    return this.service.create(createProductDto);
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
    return this.service.find(searchTerm, page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProdutoEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProdutoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: ProdutoEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProdutoDto): Promise<ProdutoEntity> {
    return this.service.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }

  @Post('/importar')
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ImportProdutoDto, isArray: true })
  async import(@Body(new ParseArrayPipe({ items: ImportProdutoDto })) importProdutoDto: ImportProdutoDto[]): Promise<void> {
    return this.service.createMany(importProdutoDto);
  }
}
