import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';
import { IsFuncionario } from 'src/commons/validations/is-funcionario.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio, OperacaoRomaneioType } from '../enum/operacao-romaneio.enum';
import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { Exclude } from 'class-transformer';
import { IsConsigancao } from 'src/commons/validations/is-consignacao.validation';

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

  @ApiProperty({ enum: OperacaoRomaneio, default: OperacaoRomaneio.venda })
  @IsNotEmpty()
  @IsEnum(OperacaoRomaneio)
  operacao: OperacaoRomaneioType | OperacaoRomaneio;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsConsigancao({ situacao: ['em_andamento'] })
  consignacaoId?: number;

  @Exclude()
  @IsOptional()
  //@IsPedido()
  pedidoId?: number;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsRomaneio({ situacao: ['encerrado'], modalidade: ['saida'] }, { each: true })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um romaneio de devolução' })
  romaneiosDevolucao?: number[];

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsRomaneio({ situacao: ['encerrado'], operacao: ['consignacao_saida'] }, { each: true })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um romaneio de saída em consignação' })
  romaneiosConsignacao?: number[];
}
