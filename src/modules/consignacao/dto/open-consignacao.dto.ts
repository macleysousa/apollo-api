import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { IsCaixa } from 'src/commons/validations/is-caixa.validation';
import { IsFuncionario } from 'src/commons/validations/is-funcionario.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

export class OpenConsignacaoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "pessoaId" é obrigatório' })
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "funcionarioId" é obrigatório' })
  @IsFuncionario()
  funcionarioId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "tabelaPrecoId" é obrigatório' })
  @IsTabelaDePreco()
  tabelaPrecoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "caixaAbertura" é obrigatório' })
  @IsCaixa({ caixaAberto: true })
  caixaAbertura: number;

  @ApiProperty()
  @IsOptional()
  @MaxLength(254, { message: 'O campo "motivoCancelamento" deve ter no máximo 254 caracteres' })
  observacao: string;
}
