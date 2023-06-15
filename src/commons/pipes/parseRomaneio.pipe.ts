import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

@Injectable()
export class ParseRomaneioPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: RomaneioService, private readonly contextService: ContextService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);
    const empresa = this.contextService.currentBranch();

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O romaneio deve ser um número.');
    }

    const romaneio = await this.service.findById(empresa.id, parsedValue);

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
  constructor(private readonly service: RomaneioService, private readonly contextService: ContextService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);
    const empresa = this.contextService.currentBranch();

    console.log('ParseRomaneioEmAndamentoPipe', value, parsedValue, empresa);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O romaneio deve ser um número.');
    }

    const romaneio = await this.service.findById(empresa.id, parsedValue);

    if (!romaneio) {
      throw new BadRequestException(`Romaneio com id ${value} não encontrado.`);
    } else if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException(`Romaneio com id ${value} não está em andamento.`);
    }

    return parsedValue;
  }
}

@Injectable()
export class ParseRomaneioEncerradoPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: RomaneioService, private readonly contextService: ContextService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);
    const empresa = this.contextService.currentBranch();

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O romaneio deve ser um número.');
    }

    const romaneio = await this.service.findById(empresa.id, parsedValue);

    if (!romaneio) {
      throw new BadRequestException(`Romaneio com id ${value} não encontrado.`);
    } else if (romaneio.situacao !== SituacaoRomaneio.Encerrado) {
      throw new BadRequestException(`Romaneio com id ${value} não está encontrado.`);
    }

    return parsedValue;
  }
}
