import { OmitType, PartialType } from '@nestjs/swagger';

import { FaturaEntity } from '../entities/fatura.entity';

export class CreateFaturaAutomaticaDto extends PartialType(
  OmitType(FaturaEntity, ['id', 'empresaId', 'data', 'situacao', 'tipoInclusao', 'operadorId', 'criadoEm', 'atualizadoEm']),
) {
  constructor(partial?: Partial<CreateFaturaAutomaticaDto>) {
    super();
    Object.assign(this, partial);
  }
}
