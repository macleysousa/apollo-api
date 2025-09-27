import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordWithCodeDto {
    @ApiProperty({ description: 'Código de 6 dígitos recebido', example: '123456' })
    @IsString({ message: 'O código deve ser uma string' })
    @IsNotEmpty({ message: 'O campo codigo é obrigatório' })
    @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos' })
    codigo: string;

    @ApiProperty({ description: 'Nova senha do usuário', minLength: 8 })
    @IsString({ message: 'A nova senha deve ser uma string' })
    @IsNotEmpty({ message: 'O campo novaSenha é obrigatório' })
    @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres' })
    novaSenha: string;
}
