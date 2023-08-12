import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { parseCsvToProduto, parseCsvToRefereciaPreco } from 'src/commons/parses/csv-to-object';

import { ImportProdutoDto } from '../produto/dto/import-produto.dto';
import { ProdutoService } from '../produto/produto.service';
import { UpSertPrecoReferenciaDto } from '../tabela-de-preco/referencia/dto/upsert-referencia.dto';
import { PrecoReferenciaService } from '../tabela-de-preco/referencia/referencia.service';
import { validateDto } from 'src/commons/validete';
import { ValidationExceptionFactory } from 'src/exceptions/validations.exception';

@Injectable()
export class ImportService {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly precoReferenciaService: PrecoReferenciaService
  ) {}

  async produtosCSV(files: Express.Multer.File[]): Promise<void> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const isCsv = files.every((file) => file.mimetype === 'text/csv');
    if (!isCsv) {
      throw new BadRequestException('Todos os arquivos devem ser do tipo CSV');
    }

    const values = (await Promise.all(files.map(async (file) => parseCsvToProduto<ImportProdutoDto>(file)))).flat();

    const errors = await validateDto(ImportProdutoDto, values);

    ValidationExceptionFactory(errors);

    // this.produtoService.createMany(values);
  }

  async referenciasPrecoCsv(files: Express.Multer.File[]): Promise<void> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const isCsv = files.every((file) => file.mimetype === 'text/csv');
    if (!isCsv) {
      throw new BadRequestException('Todos os arquivos devem ser do tipo CSV');
    }

    const values = (await Promise.all(files.map(async (file) => parseCsvToRefereciaPreco<UpSertPrecoReferenciaDto>(file)))).flat();

    const errors = await Promise.all(
      values.map(async (value) => {
        const importDto = plainToClass(UpSertPrecoReferenciaDto, value);
        return validate(importDto);
      })
    ).then((x) => x.flat());

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    } else {
      this.precoReferenciaService.upsert(values);
    }
  }
}
