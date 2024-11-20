import { OmitType, PartialType } from '@nestjs/swagger';

import { OpenConsignacaoDto } from './open-consignacao.dto';

export class UpdateConsignacaoDto extends PartialType(
  OmitType(OpenConsignacaoDto, ['pessoaId', 'tabelaPrecoId', 'caixaAbertura']),
) {}
