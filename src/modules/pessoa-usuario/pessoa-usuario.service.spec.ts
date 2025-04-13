import { Test, TestingModule } from '@nestjs/testing';
import { PessoaUsuarioService } from './pessoa-usuario.service';

describe('PessoaUsuarioService', () => {
  let service: PessoaUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PessoaUsuarioService],
    }).compile();

    service = module.get<PessoaUsuarioService>(PessoaUsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
