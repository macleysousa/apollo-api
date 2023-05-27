import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';

@Injectable()
export class VendedorService {
  constructor(
    @InjectRepository(VendedorEntity)
    private repository: Repository<VendedorEntity>
  ) {}

  async create(createVendedorDto: CreateVendedorDto): Promise<VendedorEntity> {
    const vendedor = await this.repository.save(createVendedorDto);
    return this.findById(vendedor.id);
  }

  async find(empresaId?: number, nome?: string, inativo?: boolean): Promise<VendedorEntity[]> {
    return this.repository.find({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: inativo ? Not(IsNull()) : false } });
  }

  async findById(id: number): Promise<VendedorEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateVendedorDto: UpdateVendedorDto): Promise<VendedorEntity> {
    const vendedor = await this.findById(id);
    if (!vendedor) {
      throw new BadRequestException('Vendedor não encontrado');
    }
    await this.repository.update(id, updateVendedorDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const vendedor = await this.findById(id);
    if (!vendedor) {
      throw new BadRequestException('Vendedor não encontrado');
    }

    await this.repository.delete(id).catch(() => {
      throw new BadRequestException('Não foi possível excluir o vendedor');
    });
  }
}
