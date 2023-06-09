import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioService } from '../romaneio.service';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';

@Injectable()
export class RomaneioItemService {
  constructor(
    @InjectRepository(RomaneioItemEntity)
    private readonly repository: Repository<RomaneioItemEntity>,
    private readonly romaneioService: RomaneioService,
    private readonly contextService: ContextService,
    private readonly estoqueService: EstoqueService
  ) {}

  async add(romaneioId: number, { produtoId, quantidade }: AddRemoveRomaneioItemDto): Promise<RomaneioItemEntity> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const romaneio = await this.romaneioService.findById(romaneioId);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    } else if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    const romaneioItem = await this.findByProdutoId(empresa.id, produtoId);
    const estoque = await this.estoqueService.findByProdutoId(empresa.id, produtoId);
    if (!estoque) {
      throw new BadRequestException('Produto não encontrado em estoque');
    } else if (estoque.saldo < quantidade + (romaneioItem?.quantidade ?? 0)) {
      throw new BadRequestException(`Saldo em estoque insuficiente para o produto ${produtoId}`);
    }

    await this.repository.upsert(
      {
        empresaId: empresa.id,
        romaneioId: romaneio.id,
        data: empresa.data,
        referenciaId: estoque.referenciaId,
        produtoId: estoque.produtoId,
        valorUnitario: 0,
        emPromocao: false,
        quantidade: quantidade + (romaneioItem?.quantidade ?? 0),
        operadorId: usuario.id,
      },
      { conflictPaths: ['empresaId', 'romaneioId', 'produtoId'] }
    );

    return this.findByProdutoId(empresa.id, produtoId);
  }

  async find(romaneioId: number): Promise<RomaneioItemEntity[]> {
    return this.repository.find({ where: { romaneioId } });
  }

  findByProdutoId(romaneioId: number, produtoId: number): Promise<RomaneioItemEntity> {
    return this.repository.findOne({ where: { romaneioId, produtoId } });
  }

  async remove(romaneioId: number, produtoId: number, quantidade: number): Promise<void> {
    await this.repository.delete({});
  }
}
