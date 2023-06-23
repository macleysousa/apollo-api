import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

export class RecebimentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(0.01, 1000000000, { message: 'O valor deve ser maior que 0.01 e menor que 1.000.000.000' })
  valor: number;

  @ApiProperty()
  @IsOptional()
  //@IsRomaneio()
  romaneioId?: number;

  @ApiProperty()
  @IsOptional()
  observacao?: string;
}
