import { ArgumentMetadata, BadRequestException, Injectable, ParseArrayOptions, PipeTransform } from '@nestjs/common';

import { validateDto } from '../validate-dto';
import { ValidationExceptionFactory } from 'src/exceptions/validations.exception';

@Injectable()
export class ParseArrayPipe implements PipeTransform<unknown, Promise<unknown>> {
  constructor(private options?: ParseArrayOptions) {}

  async transform(value: unknown[]) {
    if (!Array.isArray(value)) {
      throw new BadRequestException('Validation failed (array is expected)');
    }
    const errors = await validateDto(this.options.items, value, this.options);
    if (errors.length > 0) return ValidationExceptionFactory(errors);
    return value;
  }
}
