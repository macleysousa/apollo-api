import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

@Injectable()
export class ParseRomaneioPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: RomaneioService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const romaneio = await this.service.findById(parsedValue);

    if (!romaneio) {
      throw new BadRequestException(`Romaneio com id ${value} não encontrado.`);
    } else if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException(`Romaneio com id ${value} não está em andamento.`);
    }

    return parsedValue;
  }
}

@Injectable()
export class ParseRomaneioEmAndamentoPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: RomaneioService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const romaneio = await this.service.findById(parsedValue);

    if (!romaneio) {
      throw new BadRequestException(`Romaneio com id ${value} não encontrado.`);
    } else if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException(`Romaneio com id ${value} não está em andamento.`);
    }

    return parsedValue;
  }
}

@Injectable()
export class ParseRomaneioFinalizadoPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: RomaneioService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const romaneio = await this.service.findById(parsedValue);

    if (!romaneio) {
      throw new BadRequestException(`Romaneio com id ${value} não encontrado.`);
    } else if (romaneio.situacao !== SituacaoRomaneio.Finalizado) {
      throw new BadRequestException(`Romaneio com id ${value} não está finalizado.`);
    }

    return parsedValue;
  }
}
