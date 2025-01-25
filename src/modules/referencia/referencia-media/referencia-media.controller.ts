import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { UploadMediaDto } from './dto/upload-media.dto';
import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaMediaService } from './referencia-media.service';

@ApiTags('Referências - Mídias')
@Controller('referencias/:referenciaId/medias')
@ApiBearerAuth()
@ApiComponent('PRDFM007', 'Manutenção de referência - mídias')
export class ReferenciaMediaController {
  constructor(private readonly service: ReferenciaMediaService) {}

  @Post()
  @ApiResponse({ status: 200, type: ReferenciaMediaEntity })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ type: 'file', name: 'file' })
  async upload(
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ): Promise<ReferenciaMediaEntity> {
    return this.service.upload(referenciaId, file, dto);
  }

  @Get()
  async find(@Param('referenciaId', ParseIntPipe) referenciaId: number): Promise<ReferenciaMediaEntity[]> {
    return this.service.find(referenciaId);
  }

  @Get(':id')
  async findById(
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReferenciaMediaEntity> {
    return this.service.findById(referenciaId, id);
  }
}
