import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { PagamentoDto } from './pagamento.dto';
import { Type } from 'class-transformer';

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
}
