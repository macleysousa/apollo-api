import { PartialType } from '@nestjs/swagger';

import { CreateTabelaDePrecoDto } from './create-tabela-de-preco.dto';

export class UpdateTabelaDePrecoDto extends PartialType(CreateTabelaDePrecoDto) {}
