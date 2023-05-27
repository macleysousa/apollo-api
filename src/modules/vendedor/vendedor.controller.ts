import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IsEmpresaAuth } from 'src/decorators/is-empresa-auth.decorator';

import { VendedorService } from './vendedor.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';
import { ApiComponent } from '../componente/decorator/componente.decorator';

@ApiBearerAuth()
@IsEmpresaAuth()
@ApiTags('Vendedores')
@Controller('vendedores')
@ApiComponent('VENFM001', 'Manutenção de vendedor')
export class VendedorController {
  constructor(private readonly service: VendedorService) {}

  @Post()
  @ApiResponse({ status: 201, type: VendedorEntity })
  async create(@Body() createVendedorDto: CreateVendedorDto): Promise<VendedorEntity> {
    return this.service.create(createVendedorDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [VendedorEntity] })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'inativo', required: false, type: Boolean })
  async find(
    @Query('empresaId') empresaId: number,
    @Query('nome') nome: string,
    @Query('inativo') inativo: boolean
  ): Promise<VendedorEntity[]> {
    return this.service.find(empresaId, nome, inativo);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: VendedorEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<VendedorEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: VendedorEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVendedorDto: UpdateVendedorDto) {
    return this.service.update(id, updateVendedorDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: VendedorEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
