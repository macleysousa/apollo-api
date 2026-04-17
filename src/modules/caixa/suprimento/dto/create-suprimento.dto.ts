import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class CreateSuprimentoDto {
  @ApiProperty({ description: 'Valor do suprimento (monetário). Ex.: 150.50', example: 150.5 })
  @IsNotEmpty({ message: 'O campo valor é obrigatório.' })
  @IsBetween(0.01, 1000000000, { message: 'O valor deve ser maior que 0.01 e menor que 1.000.000.000' })
  valor: number;

  @ApiProperty({ description: 'Descrição ou observação do suprimento', required: false, example: 'Depósito para troco' })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: "Origem do suprimento (padrão: 'externa')", required: false, example: 'externa' })
  @IsOptional()
  origem?: string;

  constructor(partial?: Partial<CreateSuprimentoDto>) {
    Object.assign(this, partial);
  }
}
