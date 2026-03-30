import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePrecoReferenciaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "valor" é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O campo valor deve ser um número valido e com no máximo 4 casas decimais' })
  valor: number;
}
