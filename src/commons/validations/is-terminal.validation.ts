import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ContextService } from 'src/context/context.service';

import { TerminalService } from 'src/modules/empresa/terminal/terminal.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class TerminalConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(
    private readonly contextService: ContextService,
    private readonly terminalService: TerminalService
  ) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const usuario = this.contextService.usuario();
    const terminal = await this.terminalService.findById(undefined, value);
    const [options] = args.constraints;

    if (options.validarUsuario && terminal) {
      this.messageError = 'Usuário não possui acesso ao terminal';
      return usuario.terminais.some((item) => item.id === value);
    } else {
      this.messageError = 'Terminal não encontrado';
      return !!terminal;
    }
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

export const IsTerminal = (options = { validarUsuario: true }, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: TerminalConstraint,
    });
  };
};
