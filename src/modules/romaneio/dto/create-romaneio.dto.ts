import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';
import { IsFuncionario } from 'src/commons/validations/is-funcionario.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';
import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';

export class CreateRomaneioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsFuncionario()
  funcionarioId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsTabelaDePreco()
  tabelaPrecoId: number;

  @ApiProperty({ enum: ModalidadeRomaneio, default: ModalidadeRomaneio.saida })
  @IsNotEmpty()
  @IsEnum(ModalidadeRomaneio)
  modalidade: ModalidadeRomaneio;

  @ApiProperty({ enum: OperacaoRomaneio, default: OperacaoRomaneio.venda })
  @IsNotEmpty()
  @IsEnum(OperacaoRomaneio)
  operacao: OperacaoRomaneio;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsRomaneio(SituacaoRomaneio.encerrado, { each: true })
  romaneiosDevolucao?: number[];
}
