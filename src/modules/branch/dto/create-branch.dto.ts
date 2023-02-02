import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, Max, IsOptional } from 'class-validator';
import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';
import { IsCnpjValid } from 'src/commons/validations/is-cnpj.validation';

export class CreateBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @Max(999)
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsCnpjValid()
  cnpj: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  fantasyName: string;

  @ApiProperty({ enum: UF, default: UF.NotInformed })
  @IsOptional()
  uf?: UF;

  @ApiProperty()
  @IsOptional()
  numberStateRegistration?: string;

  @ApiProperty()
  @IsOptional()
  codeActivity?: string;

  @ApiProperty()
  @IsOptional()
  codeActivityCnae?: string;

  @ApiProperty({ enum: TaxRegime, default: TaxRegime.NotInformed })
  @IsOptional()
  typeTaxRegime?: TaxRegime;

  @ApiProperty({ enum: SubTributary, default: SubTributary.NotInformed })
  @IsOptional()
  typeSubTributary?: SubTributary;

  @ApiProperty()
  @IsOptional()
  suframaCode?: string;

  @ApiProperty()
  @IsOptional()
  registrationMunicipal?: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;
}
