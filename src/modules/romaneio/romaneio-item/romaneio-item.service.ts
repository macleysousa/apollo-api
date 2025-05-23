import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forEach } from 'lodash';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';
import { SituacaoRomaneio, SituacaoRomaneioType } from '../enum/situacao-romaneio.enum';
import { RomaneioService } from '../romaneio.service';

import { AddRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemView } from './views/romaneio-item.view';

interface InsertDto {
  romaneioId: number;
  produtoId: number;
  quantidade: number;
  referenciaId: number;
  valorUnitario: number;
  valorUnitDesconto?: number;
  romaneioOrigemId?: number;
  romaneioOrigemSequencia?: number;
}

@Injectable()
export class RomaneioItemService {
  constructor(
    @InjectRepository(RomaneioItemEntity)
    private readonly repository: Repository<RomaneioItemEntity>,
    @InjectRepository(RomaneioItemView)
    private readonly view: Repository<RomaneioItemView>,
    @Inject(forwardRef(() => RomaneioService))
    private readonly romaneioService: RomaneioService,
    private readonly contextService: ContextService,
    private readonly estoqueService: EstoqueService,
    private readonly precoService: PrecoReferenciaService,
  ) {}

  async add(romaneioId: number, { produtoId, quantidade }: AddRemoveRomaneioItemDto): Promise<void> {
    const empresa = this.contextService.empresa();

    const romaneio = await this.romaneioService.findById(empresa.id, romaneioId);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    } else if (romaneio.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    const romaneioItem = await this.findByProdutoId(romaneioId, produtoId);
    const quantidadeItem = romaneioItem?.sum((x) => x.quantidade) ?? 0;

    const estoque = await this.estoqueService.findByProdutoId(empresa.id, produtoId);
    const saldoDisponivel = (estoque?.saldo ?? 0) - quantidadeItem;
    if (!estoque) {
      throw new BadRequestException('Produto não encontrado em estoque');
    } else if (quantidade > saldoDisponivel && romaneio.modalidade == 'saida' && romaneio.operacao != 'consignacao_acerto') {
      throw new BadRequestException(`Saldo em estoque insuficiente para o produto ${produtoId}`);
    }

    const precoReferencia = await this.precoService.findByReferenciaId(empresa.id, estoque.referenciaId);
    if (!precoReferencia) {
      throw new BadRequestException(`Preço não encontrado para a referência ${estoque.referenciaId}`);
    } else if (precoReferencia.valor === 0) {
      throw new BadRequestException(`Referência ${estoque.referenciaId} com preço 00,00`);
    }

    if (romaneio.operacao == 'consignacao_acerto' || romaneio.operacao == 'consignacao_devolucao') {
      const consignacaoItems = await this.findByConsignacaoIds([romaneio.consignacaoId], [produtoId], ['encerrado']);
      const quantidadeConsignacaoItem =
        consignacaoItems
          ?.filter((x) => romaneio.romaneiosConsignacao.includes(x.romaneioId))
          .sum((x) => x.quantidade - x.devolvido) ?? 0;

      if (quantidadeItem + quantidade > quantidadeConsignacaoItem) {
        throw new BadRequestException(`Saldo em consignação insuficiente para o produto "${produtoId}"`);
      } else {
        const produtosConsignacao = await Promise.all(
          consignacaoItems
            .map((x) => {
              const atual = romaneioItem
                .filter((p) => p.produtoId == produtoId)
                .filter((r) => r.romaneioOrigemId == x.romaneioId && r.romaneioOrigemSequencia == x.sequencia);
              return {
                romaneioId: x.romaneioId,
                sequencia: x.sequencia,
                produtoId: x.produtoId,
                referenciaId: x.referenciaId,
                valorUnitario: x.valorUnitario,
                valorUnitDesconto: x.valorUnitDesconto,
                saldo: x.quantidade - x.devolvido - atual.sum((y) => y.quantidade),
              };
            })
            .filter((x) => x.saldo > 0),
        );

        for await (const item of produtosConsignacao) {
          if (item.saldo >= quantidade) {
            await this.insert({
              romaneioId,
              produtoId,
              quantidade: quantidade,
              referenciaId: item.referenciaId,
              valorUnitario: item.valorUnitario,
              valorUnitDesconto: item.valorUnitDesconto,
              romaneioOrigemId: item.romaneioId,
              romaneioOrigemSequencia: item.sequencia,
            });
            break;
          } else if (item.saldo < quantidade) {
            await this.insert({
              romaneioId,
              produtoId,
              quantidade: item.saldo,
              referenciaId: item.referenciaId,
              valorUnitario: item.valorUnitario,
              valorUnitDesconto: item.valorUnitDesconto,
              romaneioOrigemId: item.romaneioId,
              romaneioOrigemSequencia: item.sequencia,
            });
            quantidade -= item.saldo;
          }
        }
      }
    } else if (romaneio.romaneiosDevolucao && romaneio.romaneiosDevolucao.length > 0) {
      const romaneiosDevolucao = await this.findByRomaneioIds(romaneio.romaneiosDevolucao, [produtoId]);
      const romaneiosSaldos = await Promise.all(
        romaneiosDevolucao.map((x) => {
          const devolucaoAtual = romaneioItem
            .filter((p) => p.produtoId == produtoId)
            .filter((r) => r.romaneioOrigemId == x.romaneioId && r.romaneioOrigemSequencia == x.sequencia);
          return {
            romaneioId: x.romaneioId,
            sequencia: x.sequencia,
            produtoId: x.produtoId,
            referenciaId: x.referenciaId,
            valorUnitario: x.valorUnitario,
            valorUnitDesconto: x.valorUnitDesconto,
            saldo: x.quantidade - x.devolvido - devolucaoAtual.sum((y) => y.quantidade),
          };
        }),
      );

      const romaneiosComSaldo = romaneiosSaldos.filter((x) => x.produtoId == produtoId && x.saldo > 0);

      if (romaneiosComSaldo.sum((x) => x.saldo) < quantidade) {
        throw new BadRequestException(`Saldo de devolução do produto "${produtoId}" insuficiente para realizar a operação`);
      }

      let quantidadeDevolucao = quantidade;
      for await (const item of romaneiosComSaldo) {
        if (quantidadeDevolucao > 0 && item.saldo >= quantidadeDevolucao) {
          await this.insert({
            romaneioId,
            produtoId,
            quantidade: quantidadeDevolucao,
            referenciaId: item.referenciaId,
            valorUnitario: item.valorUnitario,
            valorUnitDesconto: item.valorUnitDesconto,
            romaneioOrigemId: item.romaneioId,
            romaneioOrigemSequencia: item.sequencia,
          });
          quantidadeDevolucao = 0;
        } else if (quantidadeDevolucao > 0) {
          await this.insert({
            romaneioId,
            produtoId,
            quantidade: quantidadeDevolucao,
            referenciaId: item.referenciaId,
            valorUnitario: item.valorUnitario,
            valorUnitDesconto: item.valorUnitDesconto,
            romaneioOrigemId: item.romaneioId,
            romaneioOrigemSequencia: item.sequencia,
          });
          quantidadeDevolucao -= item.saldo;
        }
      }
    } else if (quantidade > 0) {
      await this.insert({
        romaneioId,
        produtoId,
        quantidade,
        referenciaId: estoque.referenciaId,
        valorUnitario: precoReferencia.valor,
      });
    }
  }

  async insert(dto: InsertDto): Promise<void> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    const sequencia = await this.repository
      .createQueryBuilder()
      .select('coalesce(max(sequencia), 0) + 1', 'sequencia')
      .where({ empresaId: empresa.id, romaneioId: dto.romaneioId })
      .getRawOne()
      .then((r) => r.sequencia);

    await this.repository.insert({
      ...dto,
      empresaId: empresa.id,
      data: empresa.data,
      sequencia: sequencia,
      emPromocao: false,
      operadorId: usuario.id,
    });
  }

  async findByRomaneioId(romaneioId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId } });
  }

  async findByRomaneioIds(romaneioId: number[], produtoIds?: number[]): Promise<RomaneioItemView[]> {
    return this.view.find({
      where: { romaneioId: In(romaneioId), produtoId: produtoIds?.length > 0 ? In(produtoIds) : undefined },
    });
  }

  async findByConsignacaoIds(
    consignacaoIds: number[],
    produtoIds?: number[],
    situacoes?: SituacaoRomaneioType[],
  ): Promise<RomaneioItemView[]> {
    return this.view.find({
      where: {
        consignacaoId: In(consignacaoIds),
        produtoId: produtoIds?.length > 0 ? In(produtoIds) : undefined,
        situacao: situacoes?.length > 0 ? In(situacoes) : undefined,
      },
    });
  }

  async findByProdutoId(romaneioId: number, produtoId: number): Promise<RomaneioItemView[]> {
    return this.view.find({ where: { romaneioId, produtoId } });
  }

  async clear(romaneioId: number): Promise<void> {
    const empresaId = this.contextService.empresaId();
    const romaneio = await this.romaneioService.findById(empresaId, romaneioId);

    if (romaneio.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.delete({ romaneioId });
  }

  async remove(romaneioId: number, produtoId: number, quantidade: number): Promise<void> {
    const usuario = this.contextService.usuario();
    const item = await this.view.findOne({ where: { romaneioId, produtoId }, order: { sequencia: 'DESC' } });

    if (!item) {
      throw new BadRequestException('Item não encontrado');
    } else if (item.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    if (item.quantidade - quantidade <= 0) {
      await this.repository.delete({ romaneioId, produtoId, sequencia: item.sequencia });
    } else {
      await this.repository.update(
        { romaneioId, produtoId, sequencia: item.sequencia },
        { quantidade: item.quantidade - quantidade, operadorId: usuario.id },
      );
    }
  }
}
