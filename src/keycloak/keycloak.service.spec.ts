import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { of, throwError } from 'rxjs';

import { KeycloakService } from './keycloak.service';

describe('KeycloakService', () => {
  let service: KeycloakService;
  let httpService: HttpService;
  let cache: Cache;

  beforeEach(async () => {
    process.env.KEYCLOAK_CLIENT_ID = 'test-client-id';
    process.env.KEYCLOAK_CLIENT_SECRET = 'test-client-secret';
    process.env.KEYCLOAK_REALM = 'test-realm';
    process.env.KEYCLOAK_URL = 'http://keycloak.test';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KeycloakService>(KeycloakService);
    httpService = module.get<HttpService>(HttpService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should return an access token', async () => {
      const mockResponse = { data: { access_token: 'test-token' } };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse) as any);

      const token = await service.getAccessToken();
      expect(token).toBe('test-token');
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(service.getAccessToken()).rejects.toThrow(BadRequestException);
    });
  });

  describe('register', () => {
    it('should register a user and return user ID', async () => {
      jest.spyOn(service, 'getAccessToken').mockResolvedValue('test-token');
      const mockResponse = { status: 201, headers: { location: '/users/test-user-id' } };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse) as any);

      const userId = await service.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      expect(userId).toBe('test-user-id');
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(service, 'getAccessToken').mockResolvedValue('test-token');
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(
        service.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return login response', async () => {
      const mockResponse = { data: { access_token: 'test-token' } };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse) as any);

      const response = await service.login('john.doe@example.com', 'password123');
      expect(response).toEqual(mockResponse.data);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(service.login('john.doe@example.com', 'password123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findCertByKind', () => {
    it('should return cached certificate if available', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue('cached-cert');

      const cert = await service.findCertByKind('test-kid');
      expect(cert).toBe('cached-cert');
    });

    it('should fetch and cache certificate if not cached', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      const mockResponse = { data: { keys: [{ kid: 'test-kid', key: 'test-key' }] } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);
      jest.spyOn(crypto, 'createPublicKey').mockReturnValue({
        export: jest.fn().mockReturnValue('pem-cert'),
      } as any);
      jest.spyOn(cache, 'set').mockResolvedValue(null);

      const cert = await service.findCertByKind('test-kid');
      expect(cert).toBe('pem-cert');
    });

    it('should throw BadRequestException if certificate not found', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      const mockResponse = { data: { keys: [] } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);

      await expect(service.findCertByKind('test-kid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateToken', () => {
    it('should validate token and return subject', async () => {
      jest.spyOn(service, 'findCertByKind').mockResolvedValue('pem-cert');
      jest.spyOn(jwt, 'decode').mockReturnValue({ header: { kid: 'test-kid' }, payload: { sub: 'test-sub' } } as any);
      jest.spyOn(jwt, 'verify').mockImplementation();

      const sub = await service.validateToken('test-token');
      expect(sub).toBe('test-sub');
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      jest.spyOn(service, 'findCertByKind').mockResolvedValue('pem-cert');
      jest.spyOn(jwt, 'decode').mockReturnValue({ header: { kid: 'test-kid' }, payload: { sub: 'test-sub' } } as any);
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken('test-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
