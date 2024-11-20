import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { CaixaService } from 'src/modules/caixa/caixa.service';
import { CaixaSituacao } from 'src/modules/caixa/enum/caixa-situacao.enum';

@Injectable()
export class ParseCaixaPipe implements PipeTransform<string, Promise<number>> {
  constructor(
    private readonly service: CaixaService,
    private readonly contextService: ContextService,
  ) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O caixa deve ser um número.');
    }

    const caixa = await this.service.findById(empresa.id, parsedValue);

    if (!caixa) {
      throw new BadRequestException(`Caixa com id ${value} não encontrado.`);
    } else if (!usuario.terminais.find((x) => x.id == caixa.terminalId)) {
      throw new BadRequestException(`O caixa ${caixa.id} não está associado ao terminal do usuário.`);
    }

    return parsedValue;
  }
}

@Injectable()
export class ParseCaixaAbertoPipe implements PipeTransform<string, Promise<number>> {
  constructor(
    private readonly service: CaixaService,
    private readonly contextService: ContextService,
  ) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O caixa deve ser um número.');
    }

    const caixa = await this.service.findById(empresa.id, parsedValue);

    if (!caixa) {
      throw new BadRequestException(`Caixa com id ${value} não encontrado.`);
    } else if (!usuario.terminais.find((x) => x.id == caixa.terminalId)) {
      throw new BadRequestException(`O caixa ${caixa.id} não está associado ao terminal do usuário.`);
    } else if (caixa.situacao !== CaixaSituacao.aberto) {
      throw new BadRequestException(`O caixa ${caixa.id} não está aberto.`);
    }

    return parsedValue;
  }
}
