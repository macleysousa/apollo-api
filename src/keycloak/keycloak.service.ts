import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';

import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './responses/login.response';

@Injectable()
export class KeycloakService {
  private readonly keycloakConfig: {
    clientId: string;
    clientSecret: string;
    realm: string;
    url: string;
  };

  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {
    const keycloak = {
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_URL,
    };

    if (!keycloak.clientId || !keycloak.clientSecret || !keycloak.realm || !keycloak.url) {
      throw new Error('Keycloak variables KEYCLOAK_* have not been set properly');
    }

    this.keycloakConfig = keycloak;
  }

  async getAccessToken(): Promise<string> {
    const { data } = await firstValueFrom(
      this.http.post(
        `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.keycloakConfig.clientId,
          client_secret: this.keycloakConfig.clientSecret,
          grant_type: 'client_credentials',
        }),
      ),
    ).catch((error) => {
      throw new BadRequestException('Failed to obtain Keycloak access token.');
    });

    return data.access_token;
  }

  async register(dto: RegisterDto): Promise<any> {
    const accessToken = await this.getAccessToken();

    const body = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.email,
      email: dto.email,
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: dto.password,
          temporary: false,
        },
      ],
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await firstValueFrom(
      this.http.post(`${this.keycloakConfig.url}/admin/realms/${this.keycloakConfig.realm}/users`, body, config),
    ).catch((error) => {
      throw new BadRequestException('Failed to create user in Keycloak.');
    });

    if (response.status === 201) {
      const locationHeader = response.headers['location'];
      return locationHeader?.split('/').pop();
    }

    throw new BadRequestException('Failed to retrieve user ID from Keycloak response.');
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.http.post(
        `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.keycloakConfig.clientId,
          client_secret: this.keycloakConfig.clientSecret,
          grant_type: 'password',
          scope: 'openid profile email',
          username: email,
          password: password,
        }),
      ),
    ).catch(() => {
      throw new BadRequestException('Failed to log in to Keycloak.');
    });

    return data;
  }

  async findCertByKind(kind: string): Promise<string> {
    const value = await this.cache.get<string>(kind);

    if (value) return value;

    const url = `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/certs`;

    const response = await firstValueFrom(this.http.get(url)).catch((error) => {
      throw new BadRequestException('Failed to retrieve Keycloak certs.');
    });

    const jwk = response.data.keys.find((cert) => cert.kid === kind);
    if (!jwk) {
      throw new BadRequestException(`Chave com kid ${kind} não encontrada.`);
    }

    const publicKeyObject = crypto.createPublicKey({ key: jwk, format: 'jwk' });
    const pem = publicKeyObject.export({ type: 'spki', format: 'pem' }).toString();

    // Cache the PEM with a 10-minute expiration
    this.cache.set<string>(kind, pem, 1000 * 60 * 10);

    return pem;
  }

  async validateToken(token: string): Promise<string> {
    const decodedHeader = jwt.decode(token, { complete: true });
    const cert = await this.findCertByKind(decodedHeader.header.kid);
    try {
      jwt.verify(token, cert, { algorithms: ['RS256'] });
      return decodedHeader.payload['sub'] as string;
    } catch (error) {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
