import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { UsuarioService } from 'src/modules/usuario/usuario.service';

@Injectable()
export class ParseUsuarioPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly service: UsuarioService) {}

  async transform(value: string): Promise<number> {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('O valor deve ser um número.');
    }

    const usuario = await this.service.findById(parsedValue);

    if (!usuario) {
      throw new BadRequestException(`Não existe um usuário com o id ${parsedValue}.`);
    }

    return parsedValue;
  }
}
