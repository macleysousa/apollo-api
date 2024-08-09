import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { ConsignacaoService } from 'src/modules/consignacao/consignacao.service';

import { ConsigancaoConstraint } from './is-consignacao.validation';

describe('IsConsigancao', () => {
  let constraint: ConsigancaoConstraint;
  let service: ConsignacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsigancaoConstraint,
        {
          provide: ConsignacaoService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    constraint = module.get<ConsigancaoConstraint>(ConsigancaoConstraint);
    service = module.get<ConsignacaoService>(ConsignacaoService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return false when consignacao not found', async () => {
      const value = 1;
      const args = { constraints: [] } as ValidationArguments;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      const result = await constraint.validate(value, args);

      expect(result).toBe(false);
    });

    it('should return false when consignacao is not situacao valid', async () => {
      const value = 1;
      const args = { constraints: [{ situacao: ['em_andamento', 'encerrada'] }] } as ValidationArguments;

      jest.spyOn(service, 'findById').mockResolvedValueOnce({ situacao: 'cancelada' } as any);

      const result = await constraint.validate(value, args);

      expect(result).toBe(false);
    });

    it('should return true when consignacao is situacao valid', async () => {
      const value = 1;
      const args = { constraints: [{ situacao: ['em_andamento', 'encerrada'] }] } as ValidationArguments;

      jest.spyOn(service, 'findById').mockResolvedValueOnce({ situacao: 'em_andamento' } as any);

      const result = await constraint.validate(value, args);

      expect(result).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the error message for consignacao not found', () => {
      constraint.messageError = 'Consignação não encontrada';

      const value = 1;
      const args = { constraints: [] } as ValidationArguments;

      constraint.validate(value, args);

      const result = constraint.defaultMessage(args);

      expect(result).toBe('Consignação não encontrada');
    });
  });
});
