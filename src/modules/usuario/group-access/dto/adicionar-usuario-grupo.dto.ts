import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AdicionarUsuarioGrupoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999)
  empresaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  grupoId: number;
}
