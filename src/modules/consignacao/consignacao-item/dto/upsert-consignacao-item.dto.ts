import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';
import { IsProduto } from 'src/commons/validations/is-produto.validation';
import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';

export class UpsertConsignacaoItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "empresaId" é obrigatório' })
  @IsEmpresa()
  empresaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "consignacaoId" é obrigatório' })
  consignacaoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "romaneioId" é obrigatório' })
  @IsRomaneio()
  romaneioId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "sequencia" é obrigatório' })
  sequencia: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoId" é obrigatório' })
  @IsProduto()
  produtoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "quantidade" é obrigatório' })
  @Min(1, { message: 'O campo "quantidade" deve ser maior que zero' })
  quantidade: number;

  @ApiProperty()
  @IsOptional()
  devolvido?: number;

  @ApiProperty()
  @IsOptional()
  acertado?: number;
}
