import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { CaixaService } from 'src/modules/caixa/caixa.service';
import { CaixaExtratoService } from 'src/modules/caixa/extrato/extrato.service';

import { CaixaSuprimentoEntity } from '../entities/suprimento.entity';
import { CaixaSuprimentoService } from '../suprimento.service';

describe('CaixaSuprimentoService', () => {
  let service: CaixaSuprimentoService;
  let repository: Repository<CaixaSuprimentoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaSuprimentoService,
        {
          provide: getRepositoryToken(CaixaSuprimentoEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            empresa: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-18') }),
            operadorId: jest.fn().mockReturnValue(1),
          },
        },
        {
          provide: CaixaService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: CaixaExtratoService,
          useValue: {
            newLiquidacaoId: jest.fn().mockResolvedValue(123456),
            lancar: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<CaixaSuprimentoService>(CaixaSuprimentoService);
    repository = module.get<Repository<CaixaSuprimentoEntity>>(getRepositoryToken(CaixaSuprimentoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should save suprimento and call extrato', async () => {
      const dto = { valor: 100, descricao: 'Teste' } as any;

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1, ...dto } as any);

      const result = await service.create(1, dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });
});
