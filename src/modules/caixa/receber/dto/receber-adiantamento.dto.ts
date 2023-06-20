import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength, Validate, ValidateNested } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { PagamentoDto } from './pagamento.dto';

export class ReceberAdiantamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O valor deve ser um número com no máximo 4 casas decimais.' })
  valor: number;

  @ApiProperty({ type: [PagamentoDto] })
  @IsNotEmpty()
  //@ValidateNested({ each: true })
  formasDePagamento: PagamentoDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres.' })
  observacao: string;
}
