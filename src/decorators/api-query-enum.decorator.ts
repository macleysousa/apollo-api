import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

export function ApiQueryEnum(options: { name: string; enum: SwaggerEnumType; isArray?: boolean; required?: boolean }) {
  return applyDecorators(
    ApiQuery({
      ...options,
      type: () => options.enum,
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: options.enum,
        },
      },
    } as any),
  );
}
