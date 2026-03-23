import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MediaType } from 'src/commons/enum/media-type';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { UploadMediaDto } from './dto/upload-media.dto';
import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaMediaService } from './referencia-media.service';

@ApiTags('Referências - Mídias')
@Controller('referencias/:referenciaId/midias')
@ApiBearerAuth()
@ApiComponent('PRDFM007', 'Manutenção de referência - mídias')
export class ReferenciaMediaController {
  constructor(private readonly service: ReferenciaMediaService) {}

  @Post()
  @ApiOperation({ summary: 'Upload de mídia da referência' })
  @ApiParam({ name: 'referenciaId', type: Number })
  @ApiResponse({ status: 200, type: ReferenciaMediaEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['midia', 'type'],
      properties: {
        midia: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: Object.values(MediaType) },
        isDefault: { type: 'boolean' },
        isPublic: { type: 'boolean' },
        description: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('midia'))
  async upload(
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ): Promise<ReferenciaMediaEntity> {
    return this.service.upload(referenciaId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista mídias da referência' })
  @ApiParam({ name: 'referenciaId', type: Number })
  @ApiResponse({ status: 200, type: [ReferenciaMediaEntity] })
  async find(@Param('referenciaId', ParseIntPipe) referenciaId: number): Promise<ReferenciaMediaEntity[]> {
    return this.service.find(referenciaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca mídia por ID da referência' })
  @ApiParam({ name: 'referenciaId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ReferenciaMediaEntity })
  async findById(
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReferenciaMediaEntity> {
    return this.service.findById(referenciaId, id);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  async delete(@Param('referenciaId', ParseIntPipe) referenciaId: number, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(referenciaId, id);
  }
}
