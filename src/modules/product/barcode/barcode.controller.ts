import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';

import { BarcodeService } from './barcode.service';
import { CreateBarcodeDto } from './dto/create-barcode.dto';

@ApiTags('Products')
@Controller('products/:id/barcodes')
@ApiBearerAuth()
@ApiComponent('PRDFM009', 'Manutenção de codigo de barras')
export class BarcodeController {
  constructor(private readonly service: BarcodeService) {}

  @Post()
  async create(@Param('id', ParseIntPipe) id: number, @Body() createDto: CreateBarcodeDto): Promise<void> {
    await this.service.create(id, createDto);
  }

  @Delete(':barcode')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('barcode') barcode: string): Promise<void> {
    await this.service.remove(id, barcode);
  }
}
