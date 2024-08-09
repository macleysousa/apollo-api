import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ContextService } from 'src/context/context.service';
import { CaixaService } from 'src/modules/caixa/caixa.service';
import { CaixaSituacaoType } from 'src/modules/caixa/enum/caixa-situacao.enum';

@Injectable()
@ValidatorConstraint({ async: true })
export class CaixaConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(
    private readonly caixaService: CaixaService,
    private readonly contextService: ContextService
  ) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    const caixa = await this.caixaService.findById(empresa.id, value);
    const [options] = args.constraints;

    if (!caixa) {
      this.messageError = 'Caixa não encontrado';
      return false;
    } else if (!usuario.terminais.some((item) => item.id === caixa.terminalId)) {
      this.messageError = 'Usuário não possui acesso ao caixa';
      return false;
    } else if (options.situacao && caixa.situacao !== options.situacao) {
      this.messageError = `Caixa não está uma situação válida: ${options.situacao}`;
      return false;
    }
    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

interface options {
  situacao?: CaixaSituacaoType;
}

export const IsCaixa = (options?: options, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: CaixaConstraint,
    });
  };
};
