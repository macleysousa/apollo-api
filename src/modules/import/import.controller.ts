import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { ImportService } from './import.service';

@ApiTags('Importação')
@Controller('importacao')
@ApiBearerAuth()
export class ImportController {
  constructor(private readonly service: ImportService) {}

  @Post('/produtos/csv')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiParam({ type: 'file', name: 'file', format: 'csv' })
  @ApiComponent('IMPFP001', 'Importação de produtos via CSV')
  async produtosCSV(@UploadedFiles() files: Array<Express.Multer.File>): Promise<void> {
    await this.service.produtosCSV(files);
  }

  @Post('/referecias/preco/csv')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiParam({ type: 'file', name: 'file', format: 'csv' })
  @ApiComponent('IMPFP002', 'Importação de referências de preço via CSV')
  async referenciasPrecoCsv(@UploadedFiles() files: Array<Express.Multer.File>): Promise<void> {
    await this.service.referenciasPrecoCsv(files);
  }
}
