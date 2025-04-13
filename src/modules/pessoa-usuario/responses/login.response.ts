import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  tokenDeAcesso: string;

  @ApiProperty()
  tokenDeAtualizacao: string;

  @ApiProperty()
  tipoDeToken: string;

  @ApiProperty()
  expiracao: Date;
}
