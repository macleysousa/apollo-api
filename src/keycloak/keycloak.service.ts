import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
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
    publicKey: string;
  };

  constructor(private readonly http: HttpService) {
    const keycloak = {
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_URL,
      publicKey: process.env.KEYCLOAK_PUBLIC_KEY,
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
    ).catch((error) => {
      console.error('Error logging in to Keycloak:', error);
      throw new BadRequestException('Failed to log in to Keycloak.');
    });

    return data;
  }

  async validateToken(token: string): Promise<any> {
    // const { publicKey } = this.keycloakConfig;
    // const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    // try {
    //   const decodedToken = verify(token, formattedPublicKey, { algorithms: ['RS256'] });
    //   return decodedToken;
    // } catch (error) {
    //   console.error('Error validating token:', error.message);
    //   throw new UnauthorizedException('Token invalido ou expirado');
    // }

    const { data } = await firstValueFrom(
      this.http.get(`${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
    ).catch((error) => {
      console.error('Error validating token with Keycloak:', error);
      if (error.response?.status === 403) {
        throw new UnauthorizedException('Access denied: insufficient permissions');
      }
      throw new UnauthorizedException('Invalid or expired token');
    });
    return data;
  }
}
