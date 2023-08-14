import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { IsMarca } from 'src/commons/validations/is-marca.validation';

import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';
import { CreateCodigoBarrasDto } from '../codigo-barras/dto/create-codigo-barras.dto';

export class ImportProdutoPrecosDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Campo "tabelaDePrecoId" é obrigatório.' })
  @IsTabelaDePreco()
  tabelaDePrecoId?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "preço" é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O campo preço deve ser um número valido e com no máximo 4 casas decimais' })
  preco: number;
}

export class ImportProdutoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "referenciaId" é obrigatório.' })
  referenciaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "referenciaIdExterno" é obrigatório.' })
  referenciaIdExterno: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "referenciaNome" é obrigatório.' })
  referenciaNome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  categoriaNome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  subCategoriaNome?: string;

  @ApiProperty({ enum: UnidadeMedida })
  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidadeMedida?: UnidadeMedida;

  @ApiProperty({ required: false })
  @IsOptional()
  cst?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  ncm?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O campo "peso" deve ser um número com no máximo 4 casas decimais.' })
  peso?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMarca({ message: 'Marca inválida.' })
  marcaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  composicao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  cuidados?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoId" é obrigatório.' })
  produtoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoIdExterno" é obrigatório.' })
  produtoIdExterno: string;

  @ApiProperty({ required: false })
  @IsOptional()
  corNome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tamanhoNome?: string;

  @ApiProperty({ type: [CreateCodigoBarrasDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCodigoBarrasDto)
  codigoBarras?: CreateCodigoBarrasDto[];

  @ApiProperty({ type: [ImportProdutoPrecosDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImportProdutoPrecosDto)
  @IsArray({ message: 'O campo "precos" deve ser um array.' })
  precos?: ImportProdutoPrecosDto[];
}
