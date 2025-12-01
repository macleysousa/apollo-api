import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { RequestResetCodeDto } from './dto/request-reset-code.dto';
import { ResetPasswordWithCodeDto } from './dto/reset-password-with-code.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioService } from './pessoa-usuario.service';

describe('PessoaUsuarioService - Reset with Code', () => {
    let service: PessoaUsuarioService;
    let repository: Repository<PessoaUsuario>;
    let keycloakService: KeycloakService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PessoaUsuarioService,
                {
                    provide: getRepositoryToken(PessoaUsuario),
                    useValue: {
                        existsBy: jest.fn(),
                        findOne: jest.fn(),
                        insert: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: KeycloakService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                        validateToken: jest.fn(),
                        resetPassword: jest.fn(),
                        sendResetPasswordEmail: jest.fn(),
                        generateResetPasswordToken: jest.fn(),
                        resetPasswordWithToken: jest.fn(),
                    },
                },
                {
                    provide: PessoaService,
                    useValue: {
                        findByDocumento: jest.fn(),
                    },
                },
                {
                    provide: ContextService,
                    useValue: {
                        pessoaId: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PessoaUsuarioService>(PessoaUsuarioService);
        repository = module.get<Repository<PessoaUsuario>>(getRepositoryToken(PessoaUsuario));
        keycloakService = module.get<KeycloakService>(KeycloakService);
    });

    describe('requestResetCode', () => {
        it('should return error when user not found', async () => {
            // Arrange
            const dto: RequestResetCodeDto = { email: 'test@example.com' };
            jest.spyOn(repository, 'existsBy').mockResolvedValue(false);

            // Act
            const result = await service.requestResetCode(dto);

            // Assert
            expect(result.sucesso).toBe(false);
            expect(result.mensagem).toBe('E-mail não encontrado');
        });

        it('should generate reset code successfully', async () => {
            // Arrange
            const dto: RequestResetCodeDto = { email: 'test@example.com' };
            const mockCode = '123456';
            jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
            jest.spyOn(keycloakService, 'generateResetPasswordToken').mockResolvedValue(mockCode);

            // Act
            const result = await service.requestResetCode(dto);

            // Assert
            expect(result.sucesso).toBe(true);
            expect(result.codigo).toBe(mockCode);
            expect(keycloakService.generateResetPasswordToken).toHaveBeenCalledWith(dto.email);
        });
    });

    describe('resetPasswordWithCode', () => {
        it('should reset password with valid code', async () => {
            // Arrange
            const dto: ResetPasswordWithCodeDto = { codigo: '123456', novaSenha: 'newpassword123' };
            jest.spyOn(keycloakService, 'resetPasswordWithToken').mockResolvedValue();

            // Act
            const result = await service.resetPasswordWithCode(dto);

            // Assert
            expect(result.sucesso).toBe(true);
            expect(result.mensagem).toBe('Senha redefinida com sucesso');
            expect(keycloakService.resetPasswordWithToken).toHaveBeenCalledWith(dto.codigo, dto.novaSenha);
        });

        it('should return error with invalid code', async () => {
            // Arrange
            const dto: ResetPasswordWithCodeDto = { codigo: '999999', novaSenha: 'newpassword123' };
            jest.spyOn(keycloakService, 'resetPasswordWithToken').mockRejectedValue(new Error('Invalid code'));

            // Act
            const result = await service.resetPasswordWithCode(dto);

            // Assert
            expect(result.sucesso).toBe(false);
            expect(result.mensagem).toBe('Código inválido ou expirado');
        });
    });
});
