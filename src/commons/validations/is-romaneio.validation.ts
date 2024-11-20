import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { ModalidadeRomaneioType } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { OperacaoRomaneioType } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { SituacaoRomaneio, SituacaoRomaneioType } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class RomaneioConstraint implements ValidatorConstraintInterface {
  messageError: string;
  constructor(private readonly service: RomaneioService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const [options] = args.constraints as [options];

    const romaneio = await this.service.findById(undefined, value);

    if (!romaneio) {
      this.messageError = 'Romaneio não encontrado';
      return false;
    } else if (options.situacao && !options.situacao.includes(romaneio.situacao)) {
      this.messageError = `Romaneio ${value} não está com uma situação válida: ${options.situacao.join(', ')}`;
      return false;
    } else if (options.modalidade && !options.modalidade.includes(romaneio.modalidade)) {
      this.messageError = `Romaneio ${value} não está com uma modalidade válida: ${options.modalidade.join(', ')}`;
      return false;
    } else if (options.operacao && !options.operacao.includes(romaneio.operacao)) {
      this.messageError = `Romaneio ${value} não está com uma operação válida: ${options.operacao.join(', ')}`;
      return false;
    }

    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.messageError;
  }
}

interface options {
  situacao?: SituacaoRomaneioType[];
  modalidade?: ModalidadeRomaneioType[];
  operacao?: OperacaoRomaneioType[];
}

export const IsRomaneio = (options?: options, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options, object],
      validator: RomaneioConstraint,
    });
  };
};
