import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { v7 } from 'uuid';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class KeycloakService {
  private readonly keycloakConfig: {
    clientId: string;
    clientSecret: string;
    realm: string;
    url: string;
  };

  constructor(private readonly http: HttpService) {
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
      console.error('Error obtaining Keycloak access token:', error);
      throw new BadRequestException('Failed to obtain Keycloak access token.');
    });

    return data.access_token;
  }

  async register(dto: RegisterDto): Promise<any> {
    const accessToken = await this.getAccessToken();

    const body = {
      firstName: dto.nome,
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
      console.error('Error creating user in Keycloak:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create user in Keycloak.');
    });

    if (response.status === 201) {
      const locationHeader = response.headers['location'];
      const userId = locationHeader?.split('/').pop();
      if (userId) {
        return { id: userId };
      }
    }

    throw new BadRequestException('Failed to retrieve user ID from Keycloak response.');
  }
}
