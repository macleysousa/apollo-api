import { BadRequestException, ValidationError, HttpStatus } from '@nestjs/common';

export const ValidationExceptionFactory = (validationErrors: ValidationError[], errMessage?: any, parentField?: string) => {
  const message = errMessage ?? {};

  validationErrors.forEach((error) => {
    const errorField = parentField ? `${parentField}.${error.property}` : error?.property;

    if (!error?.constraints && error?.children?.length) {
      ValidationExceptionFactory(error?.children, message, errorField);
    } else if (error?.constraints) {
      if (!message[errorField]) {
        message[errorField] = [];
      }
      const validationsList = Object.values(error?.constraints);
      message[errorField].push(...validationsList);
    }
  });

  throw new BadRequestException({
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Validation errors',
    errors: message,
  });
};
