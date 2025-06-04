import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponse {
  @ApiProperty()
  valido: boolean;

  @ApiProperty()
  mensagem: string;
}
