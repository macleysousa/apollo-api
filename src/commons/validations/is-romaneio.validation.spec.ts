import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';

import { RomaneioConstraint } from './is-romaneio.validation';

describe('RomaneioConstraint', () => {
  let constraint: RomaneioConstraint;
  let service: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioConstraint,
        {
          provide: RomaneioService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    constraint = module.get<RomaneioConstraint>(RomaneioConstraint);
    service = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return false if romaneio does not exist', async () => {
    const romaneioId = 1;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

    const result = await constraint.validate(romaneioId, { constraints: [] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe('Romaneio não encontrado');
  });

  it('should return false if romaneio has the wrong situacao', async () => {
    const romaneioId = 1;
    const options = { situacao: ['em_andamento'] };
    const romaneio = { id: romaneioId, situacao: SituacaoRomaneio.encerrado } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [options] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe(`Romaneio ${romaneioId} não está com uma situação válida: ${options.situacao.join(', ')}`);
  });

  it('should return false if romaneio has the wrong modalidade', async () => {
    const romaneioId = 1;
    const options = { situacao: ['em_andamento'], modalidade: ['entrada'] };
    const romaneio = { id: romaneioId, situacao: SituacaoRomaneio.em_andamento, modalidade: ModalidadeRomaneio.saida } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [options] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe(`Romaneio ${romaneioId} não está com uma modalidade válida: ${options.modalidade.join(', ')}`);
  });

  it('should return false if romaneio has the wrong operação', async () => {
    const romaneioId = 1;
    const options = { situacao: ['em_andamento'], modalidade: ['saida'], operacao: ['venda'] };
    const romaneio = { id: romaneioId, situacao: 'em_andamento', modalidade: 'saida', operacao: 'transferencia' } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [options] } as any);
    expect(result).toBe(false);
    expect(constraint.messageError).toBe(`Romaneio ${romaneioId} não está com uma operação válida: ${options.operacao.join(', ')}`);
  });

  it('should return true', async () => {
    const romaneioId = 1;
    const options = { situacao: ['em_andamento'], modalidade: ['saida'], operacao: ['venda'] };
    const romaneio = { id: romaneioId, situacao: 'em_andamento', modalidade: 'saida', operacao: 'venda' } as any;

    jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

    const result = await constraint.validate(romaneioId, { constraints: [options] } as any);
    expect(result).toBe(true);
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Arrange
      constraint.messageError = `Romaneio não encontrado`;
      const validationArguments = { value: 1, constraints: [] } as ValidationArguments;

      // Act
      const result = constraint.defaultMessage(validationArguments);

      // Assert
      expect(result).toEqual(`Romaneio não encontrado`);
    });
  });
});
