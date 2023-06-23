import { Controller } from '@nestjs/common';

import { CancelarService } from './cancelar.service';

@Controller('cancelar')
export class CancelarController {
  constructor(private readonly service: CancelarService) {}
}
