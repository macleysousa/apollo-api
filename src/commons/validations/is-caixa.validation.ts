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
import { CaixaSituacao } from 'src/modules/caixa/enum/caixa-situacao.enum';

@ValidatorConstraint({ async: true })
@Injectable()
export class CaixaConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(
    private readonly caixaService: CaixaService,
    private readonly contextService: ContextService
  ) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const caixa = await this.caixaService.findById(empresa.id, value);
    const [options] = args.constraints;

    if (!caixa) {
      this.messageError = 'Caixa não encontrado';
      return false;
    } else if (!usuario.terminais.some((item) => item.id === caixa.terminalId)) {
      this.messageError = 'Usuário não possui acesso ao caixa';
      return false;
    } else if (options.caixaAberto && caixa.situacao !== CaixaSituacao.Aberto) {
      this.messageError = 'Caixa não está aberto';
      return false;
    }
    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

export const IsCaixa = (options = { caixaAberto: true }, validationOptions?: ValidationOptions) => {
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
