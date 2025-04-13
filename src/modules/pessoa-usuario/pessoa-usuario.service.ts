import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';

@Injectable()
export class PessoaUsuarioService {
  constructor(
    @InjectRepository(PessoaUsuario)
    private readonly repository: Repository<PessoaUsuario>,
    private readonly http: HttpService,
  ) {}

  async registry(dto: CreatePessoaUsuarioDto): Promise<PessoaUsuario> {
    var keycloak = {
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_URL,
    };

    if (!keycloak.clientId || !keycloak.clientSecret || !keycloak.realm || !keycloak.url) {
      throw new Error('Keycloak configuration is missing.');
    }

    const tokenResponse = await firstValueFrom(
      this.http.post(
        `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: keycloak.clientId,
          client_secret: keycloak.clientSecret,
          grant_type: 'client_credentials',
        }),
      ),
    ).catch((error) => {
      console.error('Error obtaining Keycloak access token:', error);
      throw new BadRequestException('Failed to obtain Keycloak access token.');
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await firstValueFrom(
      this.http.post(
        `${keycloak.url}/admin/realms/${keycloak.realm}/users`,
        {
          username: dto.email,
          email: dto.email,
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: dto.senha,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    ).catch((error) => {
      console.error('Error creating user in Keycloak:', error);
      throw new BadRequestException('Failed to create user in Keycloak.');
    });

    console.log('User created in Keycloak:', userResponse.data);

    const pessoaUsuario = this.repository.create(dto);
    return this.repository.save(pessoaUsuario);
  }

  async find(): Promise<PessoaUsuario[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<PessoaUsuario> {
    return this.repository.findOne({ where: { id } });
  }
}
