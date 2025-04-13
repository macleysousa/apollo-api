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
            find: jest.fn(),
            findById: jest.fn(),
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
        email: 'mockEmail',
        senha: 'mockSenha',
      };

      const result = 'mockId';
      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.registry(dto)).toBe(result);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('find', () => {
    it('should call service.find and return result', async () => {
      const result: PessoaUsuario[] = [new PessoaUsuario({ id: 'mock-uuid' })];
      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.find()).toBe(result);
      expect(service.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call service.findById with correct id and return result', async () => {
      const id = 'mock-uuid';
      const result: PessoaUsuario = new PessoaUsuario({ id });

      jest.spyOn(service, 'findById').mockResolvedValue(result);

      expect(await controller.findById(id)).toBe(result);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });
});
