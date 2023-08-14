import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';

import { CategoriaService } from '../categoria/categoria.service';
import { SubCategoriaService } from '../categoria/sub/sub.service';
import { CorService } from '../cor/cor.service';
import { CreateReferenciaDto } from '../referencia/dto/create-referencia.dto';
import { ReferenciaService } from '../referencia/referencia.service';
import { TamanhoService } from '../tamanho/tamanho.service';
import { CodigoBarrasService } from './codigo-barras/codigo-barras.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ImportProdutoDto } from './dto/import-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private repository: Repository<ProdutoEntity>,
    private categoriaService: CategoriaService,
    private subCategoriaService: SubCategoriaService,
    private referenciaService: ReferenciaService,
    private corService: CorService,
    private tamanhoService: TamanhoService,
    private codigoBarrasService: CodigoBarrasService
  ) {}

  async upsert(dto: CreateProdutoDto[]): Promise<ProdutoEntity[]> {
    await this.repository.upsert(dto, { conflictPaths: ['id'] });

    const codigoBarrasDto = dto.filter((x) => x.codigoBarras).map((x) => x.codigoBarras);
    await this.codigoBarrasService.upsert(codigoBarrasDto.flat());

    return this.repository.find({ where: { id: In(dto.map((x) => x.id)) } });
  }

  async create(createDto: CreateProdutoDto): Promise<ProdutoEntity> {
    const valueById = await this.findById(createDto.id);
    if (valueById && valueById.id == createDto.id) {
      throw new BadRequestException(`Product with id ${createDto.id} already exists`);
    }
    const product = await this.repository.save(createDto);
    return this.findById(product.id);
  }

  async createMany(dto: ImportProdutoDto[]): Promise<void> {
    const categoriasDto = dto
      .filter((x) => x.categoriaNome)
      .map((item) => item.categoriaNome.trim())
      .groupBy((item) => item)
      .select((x) => ({ nome: x.key }));

    const categorias = await this.categoriaService.upsert(categoriasDto);

    const subCategoriasDto = dto
      .filter((x) => x.categoriaNome && x.subCategoriaNome)
      .groupBy(({ categoriaNome, subCategoriaNome }) => ({
        categoriaNome: categoriaNome.trim(),
        subCategoriaNome: subCategoriaNome.trim(),
      }))
      .select((x) => ({
        categoriaId: categorias.find((c) => c.nome == x.key.categoriaNome).id,
        nome: x.key.subCategoriaNome,
      }));

    const subCategorias = await this.subCategoriaService.upsert(subCategoriasDto);

    const precosDto = dto
      .filter((x) => x.precos)
      .select((x) => x.precos.map((y) => ({ ...y, referenciaId: x.referenciaId })))
      .flat();

    const referenciasDto: CreateReferenciaDto[] = dto
      .groupBy((x) => x.referenciaId)
      .select((x) => ({
        id: x.key,
        idExterno: x.values.first().referenciaIdExterno,
        nome: x.values.first().referenciaNome,
        unidadeMedida: x.values.first().unidadeMedida,
        categoriaId: categorias.find((c) => c.nome == x.values.first().categoriaNome)?.id,
        subCategoriaId: subCategorias.find((c) => c.nome == x.values.first().subCategoriaNome)?.id,
        marcaId: x.values.first().marcaId,
        precos: precosDto.filter((y) => y.referenciaId == x.key),
      }));

    await this.referenciaService.upsert(referenciasDto);

    const coresDto = dto
      .filter((x) => x.corNome)
      .groupBy(({ corNome }) => corNome.trim())
      .select((x) => ({ nome: x.key }));

    const cores = await this.corService.upsert(coresDto);

    const tamanhoDto = dto
      .filter((x) => x.tamanhoNome)
      .groupBy(({ tamanhoNome }) => tamanhoNome.trim())
      .select((x) => ({ nome: x.key }));

    const tamanhos = await this.tamanhoService.upsert(tamanhoDto);

    const codigoBarrasDto = dto
      .filter((x) => x.codigoBarras)
      .groupBy(({ produtoId, codigoBarras }) => ({ produtoId, codigoBarras }))
      .select((x) => x.key.codigoBarras.map((y) => ({ produtoId: x.key.produtoId, ...y })))
      .flat();

    const produtos = dto
      .groupBy(({ produtoId }) => ({ produtoId }))
      .select((item) => ({
        id: item.key.produtoId,
        referenciaId: item.values.first().referenciaId,
        idExterno: item.values.first().produtoIdExterno,
        corId: cores.find((x) => x.nome == item.values.first().corNome?.trim())?.id,
        tamanhoId: tamanhos.find((x) => x.nome == item.values.first().tamanhoNome?.trim())?.id,
        codigoBarras: codigoBarrasDto.filter((x) => x.produtoId == item.key.produtoId),
      }));

    produtos.chunk(500).forEach(async (chunk) => {
      await this.upsert(chunk);
    });
  }

  async find(searchTerm?: string, page = 1, limit = 100): Promise<Pagination<ProdutoEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where({ id: Not(IsNull()) });

    queryBuilder.leftJoinAndSelect('c.cor', 'cor');
    queryBuilder.leftJoinAndSelect('c.tamanho', 'tamanho');
    queryBuilder.leftJoinAndSelect('c.referencia', 'referencia');
    queryBuilder.leftJoinAndSelect('c.codigos', 'codigo');

    if (searchTerm) {
      queryBuilder.orWhere({ id: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ nome: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ idExterno: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ referenciaId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere('referencia.idExterno LIKE :idExterno', { idExterno: `%${searchTerm}%` });
      queryBuilder.orWhere('codigo.code LIKE :codigo', { codigo: `%${searchTerm}%` });
    }

    return paginate<ProdutoEntity>(queryBuilder, { page, limit });
  }

  async findById(id: number): Promise<ProdutoEntity> {
    return this.repository.findOne({ where: { id }, loadEagerRelations: true });
  }

  async update(id: number, updateDto: UpdateProdutoDto): Promise<ProdutoEntity> {
    const valueById = await this.findById(id);
    if (!valueById) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }
    await this.repository.update(id, updateDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id }).catch(() => {
      throw new BadRequestException(`Unable to delete product with id ${id}`);
    });
  }
}
