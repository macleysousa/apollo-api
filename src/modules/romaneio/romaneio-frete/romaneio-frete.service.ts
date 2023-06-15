import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRomaneioFreteDto } from './dto/create-romaneio-frete.dto';
import { RomaneioFreteEntity } from './entities/romaneio-frete.entity';

@Injectable()
export class RomaneioFreteService {
  constructor(
    @InjectRepository(RomaneioFreteEntity)
    private readonly repository: Repository<RomaneioFreteEntity>
  ) {}

  async upsert(empresaId: number, romaneioId: number, createRomaneioFreteDto: CreateRomaneioFreteDto): Promise<RomaneioFreteEntity> {
    await this.repository.upsert({ ...createRomaneioFreteDto, empresaId, romaneioId }, { conflictPaths: ['empresaId', 'romaneioId'] });

    return this.findByRomaneioId(empresaId, romaneioId);
  }

  async findByRomaneioId(empresaId: number, romaneioId: number): Promise<RomaneioFreteEntity> {
    return this.repository.findOne({ where: { empresaId, romaneioId } });
  }

  async delete(empresaId: number, romaneioId: number): Promise<void> {
    await this.repository.delete({ empresaId, romaneioId }).catch(() => {
      throw new BadRequestException('Não foi possível excluir o frete do romaneio');
    });
  }
}
