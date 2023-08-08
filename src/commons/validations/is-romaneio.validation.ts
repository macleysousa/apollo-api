import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class RomaneioConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(private readonly service: RomaneioService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const [situacao] = args.constraints;
    const romaneio = await this.service.findById(undefined, value);

    if (!romaneio) {
      this.messageError = 'Romaneio não encontrado';
      return false;
    } else if (situacao && romaneio.situacao !== situacao) {
      this.messageError = `Romaneio ${value} não está com a situação ${situacao}`;
      return false;
    }

    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

export const IsRomaneio = (situacao?: SituacaoRomaneio, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [situacao, object],
      validator: RomaneioConstraint,
    });
  };
};
