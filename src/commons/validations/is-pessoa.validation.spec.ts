import { ValidationArguments } from 'class-validator';
import { IsPessoaConstraint } from './is-pessoa.validation';
import { PessoaService } from 'src/modules/pessoa/pessoa.service';

describe('IsPessoaConstraint', () => {
  let constraint: IsPessoaConstraint;
  let service: PessoaService;

  beforeEach(() => {
    service = new PessoaService(null);
    constraint = new IsPessoaConstraint(service);
  });

  describe('validate', () => {
    it('should return true if PessoaService.findById returns a PessoaEntity', async () => {
      const id = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id } as any);

      const result = await constraint.validate(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });

    it('should return false if PessoaService.findById returns null', async () => {
      const id = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      const result = await constraint.validate(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const id = 1;
      const args: ValidationArguments = {
        value: id,
        constraints: [],
        targetName: '',
        object: undefined,
        property: '',
      };

      const result = constraint.defaultMessage(args);

      expect(result).toBe(`Pessoa "${id}" não encontrada`);
    });
  });
});
