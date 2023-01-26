import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiForbiddenResponse, ApiOkResponse, getSchemaPath, ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class PaginationMetaDTO {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class PaginatedDTO<TData> {
  @ApiProperty()
  readonly meta: PaginationMetaDTO;

  @ApiProperty({ isArray: true })
  @IsArray()
  readonly items: TData[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDTO, model),
    ApiForbiddenResponse(),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDTO) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
