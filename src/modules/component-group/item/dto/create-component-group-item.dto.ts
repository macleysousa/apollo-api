import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsComponentValid } from 'src/modules/component/validations/is-component.validation';

export class CreateComponentGroupItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsComponentValid()
    componentId: string;
}
