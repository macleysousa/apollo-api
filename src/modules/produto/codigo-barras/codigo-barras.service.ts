import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';
import { CodigoBarrasEntity } from './entities/codigo-barras.entity';

@Injectable()
export class CodigoBarrasService {
  constructor(
    @InjectRepository(CodigoBarrasEntity)
    private repository: Repository<CodigoBarrasEntity>,
  ) {}

  async upsert(dto: CreateCodigoBarrasDto[]): Promise<CreateCodigoBarrasDto[]> {
    await this.repository.upsert(dto, { conflictPaths: ['produtoId', 'codigo'] });

    return this.repository.find({ where: { id: In(dto.map((x) => x.codigo)) } });
  }

  async create(produtoId: number, { codigo: code }: CreateCodigoBarrasDto): Promise<void> {
    const codigoExistente = await this.repository.findOne({
      where: { codigo: code },
      relations: { produto: { referencia: true } },
    });

    if (codigoExistente?.produto) {
      throw new BadRequestException({
        codigo: 'CODIGO_BARRAS_JA_CADASTRADO',
        mensagem: `O código de barras ${code} já está vinculado a outro produto`,
        codigoBarras: code,
        produto: {
          id: codigoExistente.produto.id,
          idExterno: codigoExistente.produto.idExterno,
          referencia: {
            id: codigoExistente.produto.referencia?.id,
            idExterno: codigoExistente.produto.referencia?.idExterno,
            nome: codigoExistente.produto.referencia?.nome,
          },
        },
      });
    }

    await this.repository.upsert({ produtoId, codigo: code }, { conflictPaths: ['produtoId', 'codigo'] });
  }

  async remove(produtoId: number, codigo: string): Promise<void> {
    await this.repository.delete({ produtoId, codigo });
  }
}
