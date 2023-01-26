import { Controller, Get, Post, Body, Put, Param, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ApiComponent } from '../component/component.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@ApiComponent('PRDFM008', 'Manutenção de produto')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({ status: 201, type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @IsPublic()
  @ApiPaginatedResponse(ProductEntity)
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'externalId', required: false })
  @ApiQuery({ name: 'barcode', required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Query('id') id: number,
    @Query('name') name: string,
    @Query('externalId') externalId: string,
    @Query('barcode') barcode: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number
  ): Promise<Pagination<ProductEntity>> {
    return this.productService.find(id, name, externalId, barcode, page, limit);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: ProductEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: ProductEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
