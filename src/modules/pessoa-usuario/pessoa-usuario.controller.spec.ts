import { Test, TestingModule } from '@nestjs/testing';
import { PessoaUsuarioController } from './pessoa-usuario.controller';
import { PessoaUsuarioService } from './pessoa-usuario.service';

describe('PessoaUsuarioController', () => {
  let controller: PessoaUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaUsuarioController],
      providers: [PessoaUsuarioService],
    }).compile();

    controller = module.get<PessoaUsuarioController>(PessoaUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
