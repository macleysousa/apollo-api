import { BadRequestException, ValidationError, HttpStatus } from '@nestjs/common';

export const ValidationExceptionFactory = (validationErrors: ValidationError[]) => {
  if (validationErrors.length) {
    const errors = {};

    validationErrors.forEach((e) => {
      errors[e.property] = Object.values(e.constraints);
    });

    throw new BadRequestException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Validation errors',
      errors,
    });
  }
};
