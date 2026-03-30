import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In, Not, Repository } from 'typeorm';

import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';
import { CodigoBarrasEntity } from './entities/codigo-barras.entity';

export interface CodigoBarrasResumo {
  codigo: string;
  produtoId: number;
}

@Injectable()
export class CodigoBarrasService {
  constructor(
    @InjectRepository(CodigoBarrasEntity)
    private repository: Repository<CodigoBarrasEntity>,
    @InjectRepository(EstoqueView)
    private estoqueViewRepository: Repository<EstoqueView>,
  ) {}

  async findCodigos(page = 1, limit = 100, tipo?: 'EAN13' | 'RFID'): Promise<Pagination<CodigoBarrasResumo>> {
    if (tipo && !['EAN13', 'RFID'].includes(tipo)) {
      throw new BadRequestException('Tipo de código de barras inválido. Valores aceitos: EAN13, RFID');
    }

    const queryBuilder = this.repository
      .createQueryBuilder('codigoBarras')
      .select(['codigoBarras.codigo', 'codigoBarras.produtoId'])
      .orderBy('codigoBarras.codigo', 'ASC');

    if (tipo) {
      queryBuilder.andWhere('codigoBarras.tipo = :tipo', { tipo });
    }

    const paginated = await paginate<CodigoBarrasEntity>(queryBuilder, { page, limit });

    return {
      ...paginated,
      items: paginated.items.map(({ codigo, produtoId }) => ({ codigo, produtoId })),
    };
  }

  async findProdutoByCodigo(codigo: string, empresaId: number): Promise<EstoqueView> {
    const codigoBarras = await this.repository.findOne({
      where: { codigo },
      relations: { produto: true },
    });

    if (!codigoBarras?.produto) {
      throw new NotFoundException(`Código de barras ${codigo} não encontrado`);
    }

    const estoque = await this.estoqueViewRepository.findOne({
      where: { empresaId, produtoId: codigoBarras.produto.id },
    });

    if (!estoque) {
      throw new NotFoundException(`Estoque do produto ${codigoBarras.produto.id} não encontrado para a empresa ${empresaId}`);
    }

    return estoque;
  }

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
