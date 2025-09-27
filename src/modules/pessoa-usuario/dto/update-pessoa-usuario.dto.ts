import { OmitType } from '@nestjs/swagger';

import { CreatePessoaUsuarioDto } from './create-pessoa-usuario.dto';

export class UpdatePessoaUsuarioDto extends OmitType(CreatePessoaUsuarioDto, ['email', 'senha'] as const) {}
