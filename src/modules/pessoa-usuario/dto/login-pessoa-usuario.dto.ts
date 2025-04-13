import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginPessoaUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  senha: string;
}
