import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { RomaneioService } from '../romaneio.service';
import { UpSertRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemView } from './views/romaneio-item.view';

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

  async add(romaneioId: number, { produtoId, quantidade }: UpSertRemoveRomaneioItemDto): Promise<RomaneioItemView> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const romaneio = await this.romaneioService.findById(empresa.id, romaneioId);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    } else if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    const romaneioItem = await this.findByProdutoId(romaneioId, produtoId);
    const romaneioItemQuantidade = romaneioItem?.sum((x) => x.quantidade) ?? 0;

    const estoque = await this.estoqueService.findByProdutoId(empresa.id, produtoId);
    if (!estoque) {
      throw new BadRequestException('Produto não encontrado em estoque');
    } else if (estoque.saldo < quantidade + romaneioItemQuantidade && romaneio.modalidade == ModalidadeRomaneio.Saida) {
      throw new BadRequestException(`Saldo em estoque insuficiente para o produto ${produtoId}`);
    }

    const precoReferencia = await this.precoService.findByReferenciaId(empresa.id, estoque.referenciaId);
    if (!precoReferencia) {
      throw new BadRequestException(`Preço não encontrado para a referência ${estoque.referenciaId}`);
    } else if (precoReferencia.preco === 0) {
      throw new BadRequestException(`Referência ${estoque.referenciaId} com preço 00,00`);
    }

    const sequencia = await this.repository
      .createQueryBuilder()
      .select('coalesce(max(sequencia), 0) + 1', 'sequencia')
      .where({ empresaId: empresa.id, romaneioId: romaneioId })
      .getRawOne()
      .then((r) => r.sequencia);

    await this.repository.insert({
      empresaId: empresa.id,
      romaneioId: romaneioId,
      data: empresa.data,
      sequencia: sequencia,
      referenciaId: estoque.referenciaId,
      produtoId: estoque.produtoId,
      valorUnitario: precoReferencia.preco,
      emPromocao: false,
      quantidade: quantidade,
      operadorId: usuario.id,
    });

    return this.view.findOne({ where: { romaneioId: romaneioId, sequencia: sequencia, produtoId: produtoId } });
  }

  async find(romaneioId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId } });
  }

  async findByProdutoId(romaneioId: number, produtoId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId, produtoId } });
  }

  async clear(romaneioId: number): Promise<void> {
    const empresaId = this.contextService.empresaId();
    const romaneio = await this.romaneioService.findById(empresaId, romaneioId);

    if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.delete({ romaneioId });
  }

  async remove(romaneioId: number, produtoId: number, quantidade: number): Promise<void> {
    const usuario = this.contextService.currentUser();
    const item = await this.view.findOne({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });

    if (!item) {
      throw new BadRequestException('Item não encontrado');
    } else if (item.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    if (item.quantidade - quantidade <= 0) {
      await this.repository.delete({ romaneioId, produtoId, sequencia: item.sequencia });
    } else {
      await this.repository.update(
        { romaneioId, produtoId, sequencia: item.sequencia },
        { quantidade: item.quantidade - quantidade, operadorId: usuario.id }
      );
    }
  }
}
