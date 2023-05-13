import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsComponentValid } from 'src/modules/componente/validations/is-component.validation';

export class AddComponentGroupItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsComponentValid()
  componenteId: string;
}
