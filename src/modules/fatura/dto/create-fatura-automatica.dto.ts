import { OmitType, PartialType } from '@nestjs/swagger';

import { FaturaEntity } from '../entities/fatura.entity';

export class CreateFaturaAutimaticaDto extends PartialType(
  OmitType(FaturaEntity, ['id', 'empresaId', 'data', 'situacao', 'tipoInclusao', 'operadorId', 'criadoEm', 'atualizadoEm']),
) {
  constructor(partial?: Partial<CreateFaturaAutimaticaDto>) {
    super();
    Object.assign(this, partial);
  }
}
