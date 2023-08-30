import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

export class ConsignacaoItemFilter {
  @ApiProperty()
  @IsOptional()
  @IsEmpresa({ each: true })
  empresaIds?: number[];

  @ApiProperty()
  @IsOptional()
  consignacaoIds?: number[];

  @ApiProperty()
  @IsOptional()
  romaneiroIds?: number[];

  @ApiProperty()
  @IsOptional()
  produtoIds?: number[];
}
