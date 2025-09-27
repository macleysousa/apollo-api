import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Senha atual do usuário' })
  @IsString({ message: 'A senha atual deve ser uma string' })
  @IsNotEmpty({ message: 'O campo senhaAtual é obrigatório' })
  senhaAtual: string;

  @ApiProperty({ description: 'Nova senha do usuário', minLength: 8 })
  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'O campo novaSenha é obrigatório' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres' })
  novaSenha: string;
}
