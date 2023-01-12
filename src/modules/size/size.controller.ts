import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../component/component.decorator';
import { SizeEntity } from './entities/size.entity';

@ApiTags('Sizes')
@Controller('sizes')
@ApiBearerAuth()
@ApiComponent('PRDFM002', 'Manutenção de tamanho de produto')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiResponse({ status: 201, type: SizeEntity })
  async create(@Body() createSizeDto: CreateSizeDto): Promise<SizeEntity> {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [SizeEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(@Query('name') name?: string, @Query('active') active?: boolean | unknown): Promise<SizeEntity[]> {
    return this.sizeService.find(name, active);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SizeEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<SizeEntity> {
    return this.sizeService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: SizeEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSizeDto: UpdateSizeDto): Promise<SizeEntity> {
    return this.sizeService.update(id, updateSizeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sizeService.remove(id);
  }
}
