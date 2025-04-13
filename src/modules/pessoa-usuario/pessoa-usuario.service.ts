import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';

@Injectable()
export class PessoaUsuarioService {
  constructor(
    @InjectRepository(PessoaUsuario)
    private readonly repository: Repository<PessoaUsuario>,
    private readonly keycloakService: KeycloakService,
    private readonly pessoaService: PessoaService,
  ) {}

  async register(dto: CreatePessoaUsuarioDto): Promise<string> {
    const [emailExists, documentoExists] = await Promise.all([
      this.repository.existsBy({ email: dto.email }),
      this.repository.existsBy({ documento: dto.documento }),
    ]);

    if (emailExists) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    if (documentoExists) {
      throw new BadRequestException('Documento já cadastrado');
    }

    const usuarioId = await this.keycloakService.register(dto);

    const pessoa = await this.pessoaService.findByDocumento(dto.documento);

    await this.repository.insert({ id: usuarioId, pessoaId: pessoa?.id, ...dto });

    return 'Usuário cadastrado com sucesso';
  }

  async find(): Promise<PessoaUsuario[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<PessoaUsuario> {
    return this.repository.findOne({ where: { id } });
  }
}
