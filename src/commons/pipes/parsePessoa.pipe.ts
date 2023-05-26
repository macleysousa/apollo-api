import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { PessoaService } from 'src/modules/pessoa/pessoa.service';

@Injectable()
export class ParsePessoaPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: PessoaService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const pessoa = await this.service.findById(parsedValue);

    if (!pessoa) {
      throw new BadRequestException(`Pessoa com id ${value} não encontrada.`);
    }

    return parsedValue;
  }
}
