import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { EmpresaService } from 'src/modules/empresa/empresa.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BranchConstraint implements ValidatorConstraintInterface {
  constructor(private readonly branchService: EmpresaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const branch = await this.branchService.findById(value);

    return branch ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'branch not found';
  }
}

export const IsBranch = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: BranchConstraint,
    });
  };
};
