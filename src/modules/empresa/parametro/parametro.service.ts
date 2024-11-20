import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateParametroDto } from './dto/create-parametro.dto';
import { EmpresaParametroEntity } from './entities/parametro.entity';
import { EmpresaParametroView } from './views/parametro.view';
import { UpdateEmpresaParametroDto } from './dto/update-parametro.dto';
import { Parametro } from 'src/modules/parametro/enum/parametros';

@Injectable()
export class EmpresaParametroService {
  constructor(
    @InjectRepository(EmpresaParametroEntity)
    private repository: Repository<EmpresaParametroEntity>,
    @InjectRepository(EmpresaParametroView)
    private view: Repository<EmpresaParametroView>
  ) {}

  async create(empresaId: number, createParametroDto: CreateParametroDto): Promise<EmpresaParametroView> {
    await this.repository.upsert({ ...createParametroDto, empresaId }, { conflictPaths: ['empresaId', 'parametroId'] });
    return this.findByParametroId(empresaId, createParametroDto.parametroId);
  }

  async find(empresaId: number): Promise<EmpresaParametroView[]> {
    return this.view.find({ where: { empresaId } });
  }

  async findByParametroId(empresaId: number, parametroId: Parametro): Promise<EmpresaParametroView> {
    return this.view.findOne({ where: { empresaId, parametroId } });
  }

  async update(empresaId: number, parametroId: Parametro, updateParametroDto: UpdateEmpresaParametroDto): Promise<EmpresaParametroView> {
    await this.repository.upsert({ ...updateParametroDto, empresaId }, { conflictPaths: ['empresaId', 'parametroId'] });
    return this.findByParametroId(empresaId, parametroId);
  }
}
