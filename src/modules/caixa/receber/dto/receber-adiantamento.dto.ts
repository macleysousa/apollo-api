import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { PagamentoDto } from './pagamento.dto';

export class ReceberAdiantamentoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo pessoaId é obrigatório.' })
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo valor é obrigatório.' })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O valor deve ser um número com no máximo 4 casas decimais.' })
  valor: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo formasDePagamento é obrigatório.' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma forma de pagamento.' })
  @ValidateNested({ each: true })
  @Type(() => PagamentoDto)
  formasDePagamento: PagamentoDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres.' })
  observacao: string;

  constructor(partial?: Partial<ReceberAdiantamentoDto>) {
    Object.assign(this, partial);
  }
}
