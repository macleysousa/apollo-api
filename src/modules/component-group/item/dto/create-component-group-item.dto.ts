import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsComponentValid } from 'src/modules/component/validations/is-component.validation';

export class AddComponentGroupItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsComponentValid()
  componentId: string;
}
