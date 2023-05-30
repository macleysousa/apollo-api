import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { EmpresaService } from 'src/modules/empresa/empresa.service';

@Injectable()
export class ParseEmpresaPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: EmpresaService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const empresa = await this.service.findById(parsedValue);

    if (!empresa) {
      throw new BadRequestException(`Não existe uma empresa com o id ${parsedValue}.`);
    }

    return parsedValue;
  }
}
