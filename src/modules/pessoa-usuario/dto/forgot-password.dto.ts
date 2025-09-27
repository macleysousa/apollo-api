import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'E-mail do usuário para redefinição de senha' })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  email: string;
}
