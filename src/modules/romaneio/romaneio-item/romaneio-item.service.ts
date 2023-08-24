import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { RomaneioService } from '../romaneio.service';
import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
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

  async add(romaneioId: number, { produtoId, quantidade }: AddRemoveRomaneioItemDto): Promise<RomaneioItemView> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

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

    const romaneioDevolucaoIds = [];
    if (romaneio.romaneiosDevolucao?.length > 0) {
      const romaneiosDevolucao = await this.findByRomaneioIds(romaneio.romaneiosDevolucao);
      const romaneiosSaldos = romaneiosDevolucao.map((x) => {
        const devolucaoAtual = romaneioItem.filter((y) => y.romaneiosDevolucao.includes(x.romaneioId) && y.produtoId == x.produtoId);
        return {
          romaneioId: x.romaneioId,
          produtoId: x.produtoId,
          saldo: x.quantidade - x.devolvido - devolucaoAtual.sum((y) => y.quantidade),
        };
      });

      const romaneiosComSaldo = romaneiosSaldos.filter((x) => x.produtoId == produtoId && x.saldo > 0);

      if (romaneiosComSaldo.sum((x) => x.saldo) < quantidade) {
        throw new BadRequestException(`Saldo de devolução do produto "${produtoId}" insuficiente para realizar a operação`);
      }

      let quantidadeDevolucao = quantidade;
      romaneiosComSaldo.map((x) => {
        if (x.saldo >= quantidadeDevolucao) {
          romaneioDevolucaoIds.push(x.romaneioId);
          quantidadeDevolucao = 0;
        } else {
          romaneioDevolucaoIds.push(x.romaneioId);
          quantidadeDevolucao -= x.saldo;
        }
      });
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
      romaneiosDevolucao: romaneioDevolucaoIds,
    });

    return this.view.findOne({ where: { romaneioId: romaneioId, sequencia: sequencia, produtoId: produtoId } });
  }

  async find(romaneioId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId } });
  }

  async findByRomaneioIds(romaneioId: number[]): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId: In(romaneioId) } });
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
    const usuario = this.contextService.usuario();
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
