import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { ReferenceEntity } from './entities/reference.entity';
import { ParseIntPipe } from '@nestjs/common/pipes';

@ApiTags('References')
@Controller('references')
@ApiBearerAuth()
@ApiComponent('PRDFM003', 'Manutenção de referencia')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Post()
  @ApiResponse({ type: ReferenceEntity, status: 201 })
  async create(@Body() createReferenceDto: CreateReferenceDto): Promise<ReferenceEntity> {
    return this.referenceService.create(createReferenceDto);
  }

  @Get()
  @ApiResponse({ type: [ReferenceEntity], status: 200 })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'externalId', required: false })
  async find(@Query('name') name?: string, @Query('externalId') externalId?: string): Promise<ReferenceEntity[]> {
    return this.referenceService.find(name, externalId);
  }

  @Get(':id')
  @ApiResponse({ type: ReferenceEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReferenceEntity> {
    return this.referenceService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ type: ReferenceEntity, status: 200 })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReferenceDto: UpdateReferenceDto): Promise<ReferenceEntity> {
    return this.referenceService.update(id, updateReferenceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.referenceService.remove(id);
  }
}
