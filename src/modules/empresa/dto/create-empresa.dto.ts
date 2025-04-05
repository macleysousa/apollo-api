import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';
import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsCnpjValid } from 'src/commons/validations/is-cnpj.validation';

export class CreateEmpresaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBetween(1, 999)
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsCnpjValid()
  cnpj: string;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  nomeFantasia: string;

  @ApiProperty({ enum: UF, default: UF.NaoInformado, required: false })
  @IsOptional()
  uf?: UF;

  @ApiProperty({ required: false })
  @IsOptional()
  inscricaoEstadual?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  codigoDeAtividade?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  codigoDeNaturezaJuridica?: string;

  @ApiProperty({ enum: TaxRegime, default: TaxRegime.NaoInformado })
  @IsOptional()
  regime?: TaxRegime;

  @ApiProperty({ enum: SubTributary, default: SubTributary.NaoInformado })
  @IsOptional()
  @IsEnum(SubTributary)
  substituicaoTributaria?: SubTributary;

  @ApiProperty({ required: false })
  @IsOptional()
  suframa?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  registroMunicipal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  telefone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;
}
