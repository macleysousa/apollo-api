import { ArgumentMetadata, BadRequestException, Injectable, ParseArrayOptions, PipeTransform } from '@nestjs/common';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { isEnum } from 'class-validator';

import { ValidationExceptionFactory } from 'src/exceptions/validations.exception';

import { validateDto } from '../validate-dto';

@Injectable()
export class ParseArrayPipe implements PipeTransform<unknown, Promise<unknown>> {
  constructor(private options?: { enum?: SwaggerEnumType; isArray?: boolean } & ParseArrayOptions) {}

  async transform(value: unknown[], metadata: ArgumentMetadata) {
    const _value = Array.isArray(value) ? value : [value];
    if (this.options?.enum && !_value.first((v) => isEnum(v, this.options.enum))) {
      throw new BadRequestException('Invalid enum value');
    } else if (this.options?.items) {
      const errors = await validateDto(this.options.items, _value, this.options);
      if (errors.length > 0) return ValidationExceptionFactory(errors);
    }
    return _value;
  }
}
