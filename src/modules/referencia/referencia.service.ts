import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PrecoReferenciaService } from '../tabela-de-preco/referencia/referencia.service';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ReferenciaEntity } from './entities/referencia.entity';
import { ReferenciaFilter } from './filters/referencia.filter';
import { ReferenciaInclude, ReferenciaIncludeEnum } from './includes/referencia.include';

@Injectable()
export class ReferenciaService {
  constructor(
    @InjectRepository(ReferenciaEntity)
    private referenceRepository: Repository<ReferenciaEntity>,
    private precoReferenciaService: PrecoReferenciaService,
  ) {}

  async upsert(createReferenceDto: CreateReferenciaDto[]): Promise<ReferenciaEntity[]> {
    await this.referenceRepository.upsert(createReferenceDto, { conflictPaths: ['id'] });

    const precos = createReferenceDto.filter((r) => r.precos).map((r) => r.precos);
    await this.precoReferenciaService.upsert(precos.flat());

    return this.referenceRepository.find({ where: createReferenceDto.map((ref) => ({ id: ref.id })) });
  }

  async create(createReferenceDto: CreateReferenciaDto): Promise<ReferenciaEntity> {
    const reference = await this.referenceRepository.save(createReferenceDto);

    return this.findById(reference.id);
  }

  async find(filter?: ReferenciaFilter): Promise<ReferenciaEntity[]> {
    const queryBuilder = this.referenceRepository.createQueryBuilder('r');
    queryBuilder.where('r.id IS NOT NULL');

    if (filter?.nome) {
      queryBuilder.andWhere('r.nome ILIKE :nome', { nome: `%${filter.nome}%` });
    }

    if (filter?.idExterno) {
      queryBuilder.andWhere('r.idExterno ILIKE :idExterno', { idExterno: `%${filter.idExterno}%` });
    }

    if (filter?.incluir?.length > 0) {
      filter.incluir = filter.incluir.includes('tudo') ? Object.values(ReferenciaIncludeEnum) : filter.incluir;

      filter.incluir.forEach((include) => {
        switch (include) {
          case 'categoria':
            queryBuilder.leftJoinAndSelect('r.categoria', 'categoria');
            break;
          case 'subCategoria':
            queryBuilder.leftJoinAndSelect('r.subCategoria', 'subCategoria');
            break;
        }
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: number, incluir?: ReferenciaInclude[]): Promise<ReferenciaEntity> {
    return this.referenceRepository.findOne({ where: { id }, relations: incluir });
  }

  async update(id: number, updateReferenceDto: UpdateReferenciaDto): Promise<ReferenciaEntity> {
    const reference = await this.findById(id);
    if (!reference) {
      throw new BadRequestException('Reference not found');
    }
    await this.referenceRepository.save({ ...reference, ...updateReferenceDto });

    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.referenceRepository.delete({ id });
  }
}
