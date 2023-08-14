import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { parseCsvToProduto, parseCsvToRefereciaPreco } from 'src/commons/parses/csv-to-object';
import { validateDto } from 'src/commons/validate-dto';
import { ValidationExceptionFactory } from 'src/exceptions/validations.exception';

import { ImportProdutoDto } from '../produto/dto/import-produto.dto';
import { ProdutoService } from '../produto/produto.service';
import { AddPrecoReferenciaDto } from '../tabela-de-preco/referencia/dto/add-referencia.dto';
import { PrecoReferenciaService } from '../tabela-de-preco/referencia/referencia.service';
import { ImportPrecoDto } from '../tabela-de-preco/referencia/dto/import-precos.dto';

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
    if (errors.length > 0) return ValidationExceptionFactory(errors);

    this.produtoService.createMany(values);
  }

  async referenciasPrecoCsv(files: Express.Multer.File[]): Promise<void> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const isCsv = files.every((file) => file.mimetype === 'text/csv');
    if (!isCsv) {
      throw new BadRequestException('Todos os arquivos devem ser do tipo CSV');
    }

    const values = (await Promise.all(files.map(async (file) => parseCsvToRefereciaPreco<ImportPrecoDto>(file)))).flat();

    const errors = await validateDto(ImportPrecoDto, values);
    if (errors.length > 0) return ValidationExceptionFactory(errors);

    this.precoReferenciaService.upsert(values);
  }
}
