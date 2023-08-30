import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { CodigoBarrasService } from './codigo-barras.service';
import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';

@ApiTags('Produtos')
@Controller('produtos/:id/codigo-barras')
@ApiBearerAuth()
@ApiComponent('PRDFM009', 'Manutenção de codigo de barras')
export class CodigoBarrasController {
  constructor(private readonly service: CodigoBarrasService) {}

  @Post()
  async create(@Param('id', ParseIntPipe) id: number, @Body() createDto: CreateCodigoBarrasDto): Promise<void> {
    await this.service.create(id, createDto);
  }

  @Delete(':barcode')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('barcode') barcode: string): Promise<void> {
    await this.service.remove(id, barcode);
  }
}
