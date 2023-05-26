import { PartialType } from '@nestjs/swagger';

import { CreatePessoaEnderecoDto } from './create-pessoa-endereco.dto';

export class UpdatePessoaEnderecoDto extends PartialType(CreatePessoaEnderecoDto) {}
