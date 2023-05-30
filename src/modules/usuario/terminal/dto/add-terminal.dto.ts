import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';
import { IsTerminal } from 'src/commons/validations/is-terminal.validation';

export class AddUsuarioTerminalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmpresa()
  empresaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsTerminal({ validarUsuario: false })
  terminalId: number;
}
