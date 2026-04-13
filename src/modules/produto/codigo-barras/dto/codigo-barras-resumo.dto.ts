import { ApiProperty } from '@nestjs/swagger';

export class CodigoBarrasResumoDto {
  @ApiProperty()
  codigo: string;

  @ApiProperty()
  produtoId: number;
}
