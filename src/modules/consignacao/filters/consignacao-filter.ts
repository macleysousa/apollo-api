import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { SituacaoConsignacao, SituacaoConsignacaoEnum } from '../enum/situacao-consignacao.enum';

import { IsFuncionario } from 'src/commons/validations/is-funcionario.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';
import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

export class ConsignacaoFilter {
  @ApiProperty()
  @IsOptional()
  @IsEmpresa({ each: true })
  empresaIds?: number[];

  @ApiProperty()
  @IsOptional()
  @IsPessoa({ each: true })
  pessoaIds?: number[];

  @ApiProperty()
  @IsOptional()
  @IsFuncionario({ each: true })
  funcionarioIds?: number[];

  @ApiProperty({ enum: SituacaoConsignacaoEnum, isArray: true })
  @IsOptional()
  @IsEnum(SituacaoConsignacaoEnum, { each: true })
  situacoes?: SituacaoConsignacao[];
}
