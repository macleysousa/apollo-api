import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateGroupAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999)
  branchId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
