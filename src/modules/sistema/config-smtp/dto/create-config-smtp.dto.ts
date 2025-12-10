import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

class RedefinirSenhaTemplate {
  @ApiProperty()
  @IsNotEmpty()
  assunto: string;

  @ApiProperty()
  @IsNotEmpty()
  corpo: string;
}

export class CreateConfigSmtpDto {
  @ApiProperty()
  @IsNotEmpty()
  servidor: string;

  @ApiProperty()
  @IsNotEmpty()
  porta: number;

  @ApiProperty()
  @IsNotEmpty()
  usuario: string;

  @ApiProperty()
  @IsNotEmpty()
  senha: string;

  @ApiPropertyOptional({ type: RedefinirSenhaTemplate })
  @IsOptional()
  @Type(() => RedefinirSenhaTemplate)
  @ValidateNested()
  redefinirSenhaTemplate?: RedefinirSenhaTemplate;
}
