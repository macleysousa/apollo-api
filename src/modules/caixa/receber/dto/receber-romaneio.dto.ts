import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';

export class ReceberRomaneioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsRomaneio(SituacaoRomaneio.EmAndamento, { message: 'Romaneio não está Em Andamento' })
  romaneioId: number;
}
