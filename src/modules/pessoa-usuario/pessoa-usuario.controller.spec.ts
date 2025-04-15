import { Test, TestingModule } from '@nestjs/testing';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioController } from './pessoa-usuario.controller';
import { PessoaUsuarioService } from './pessoa-usuario.service';

describe('PessoaUsuarioController', () => {
  let controller: PessoaUsuarioController;
  let service: PessoaUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaUsuarioController],
      providers: [
        {
          provide: PessoaUsuarioService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            findPerfil: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PessoaUsuarioController>(PessoaUsuarioController);
    service = module.get<PessoaUsuarioService>(PessoaUsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('registry', () => {
    it('should call service.register with correct parameters and return result', async () => {
      const dto: CreatePessoaUsuarioDto = {
        documento: 'mockDocumento',
        nome: 'mockNome',
        sobrenome: 'mockSobrenome',
        email: 'mockEmail',
        senha: 'mockSenha',
      };

      const result = 'mockId';
      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.registry(dto)).toBe(result);
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    describe('login', () => {
      it('should call service.login with correct parameters and return result', async () => {
        const dto = {
          email: 'mockEmail',
          senha: 'mockSenha',
        };

        const result = {
          token: 'mockToken',
          usuario: {
            id: 'mockId',
            nome: 'mockNome',
            email: 'mockEmail',
          },
        } as any;
        jest.spyOn(service, 'login').mockResolvedValue(result);

        expect(await controller.login(dto)).toBe(result);
        expect(service.login).toHaveBeenCalledWith(dto);
      });
    });

    describe('findPerfil', () => {
      it('should call service.findPerfil with correct token and return result', async () => {
        const mockRequest = {
          token: 'mockToken',
        };

        const result: PessoaUsuario = new PessoaUsuario({
          id: 'mockId',
          nome: 'mockNome',
          sobrenome: 'mockSobrenome',
          email: 'mockEmail',
          documento: 'mockDocumento',
        });

        jest.spyOn(service, 'findPerfil').mockResolvedValue(result);

        expect(await controller.findPerfil(mockRequest)).toBe(result);
        expect(service.findPerfil).toHaveBeenCalledWith(mockRequest.token);
      });
    });
  });
});
