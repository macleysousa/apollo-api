import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ConsignacaoService } from 'src/modules/consignacao/consignacao.service';
import { SituacaoConsignacao } from 'src/modules/consignacao/enum/situacao-consignacao.enum';

@Injectable()
@ValidatorConstraint({ async: true })
export class ConsigancaoConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(private readonly service: ConsignacaoService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const [options] = args.constraints as options[];

    const consignacao = await this.service.findById(undefined, value);

    if (!consignacao) {
      this.messageError = 'Consignação não encontrada';
      return false;
    } else if (options.situacao && !options.situacao.includes(consignacao.situacao)) {
      this.messageError = `Consignação ${value} não está em uma situação válida`;
      return false;
    }

    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

interface options {
  situacao?: SituacaoConsignacao[];
}

export const IsConsigancao = (options?: options, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options, object],
      validator: ConsigancaoConstraint,
    });
  };
};
