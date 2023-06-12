import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioService } from '../romaneio.service';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';
import { RomaneioItemView } from './views/romaneio-item.view';
import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';

@Injectable()
export class RomaneioItemService {
  constructor(
    @InjectRepository(RomaneioItemEntity)
    private readonly repository: Repository<RomaneioItemEntity>,
    @InjectRepository(RomaneioItemView)
    private readonly view: Repository<RomaneioItemView>,
    private readonly romaneioService: RomaneioService,
    private readonly contextService: ContextService,
    private readonly estoqueService: EstoqueService,
    private readonly precoService: PrecoReferenciaService
  ) {}

  async add(romaneioId: number, { produtoId, quantidade }: AddRemoveRomaneioItemDto): Promise<RomaneioItemView> {
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
    } else if (estoque.saldo < quantidade + (romaneioItem?.quantidade ?? 0) && romaneio.modalidade == ModalidadeRomaneio.Saida) {
      throw new BadRequestException(`Saldo em estoque insuficiente para o produto ${produtoId}`);
    }

    const precoReferencia = await this.precoService.findByReferenciaId(empresa.id, estoque.referenciaId);
    if (!precoReferencia) {
      throw new BadRequestException(`Preço não encontrado para a referência ${estoque.referenciaId}`);
    } else if (precoReferencia.preco === 0) {
      throw new BadRequestException(`Referência ${estoque.referenciaId} com preço 00,00`);
    }

    await this.repository.upsert(
      {
        empresaId: empresa.id,
        romaneioId: romaneio.romaneioId,
        data: empresa.data,
        referenciaId: estoque.referenciaId,
        produtoId: estoque.produtoId,
        valorUnitario: precoReferencia.preco,
        emPromocao: false,
        quantidade: quantidade + (romaneioItem?.quantidade ?? 0),
        operadorId: usuario.id,
      },
      { conflictPaths: ['empresaId', 'romaneioId', 'produtoId'] }
    );

    return this.findByProdutoId(empresa.id, produtoId);
  }

  async find(romaneioId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId } });
  }

  async findByProdutoId(romaneioId: number, produtoId: number): Promise<RomaneioItemView> {
    return this.view.findOne({ where: { romaneioId, produtoId } });
  }

  async remove(romaneioId: number, produtoId: number, quantidade: number): Promise<void> {
    await this.repository.delete({});
  }
}
