import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetResponse {
  @ApiProperty({ description: 'Status da operação' })
  sucesso: boolean;

  @ApiProperty({ description: 'Mensagem de retorno' })
  mensagem: string;
}
