import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiForbiddenResponse, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
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
              total_items: { type: 'integer', example: 100 },
              item_count: { type: 'integer', example: 10 },
              items_per_page: { type: 'integer', example: 10 },
              total_pages: { type: 'integer', example: 10 },
              current_page: { type: 'integer', example: 1 },
              has_next_page: { type: 'boolean', example: true },
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
