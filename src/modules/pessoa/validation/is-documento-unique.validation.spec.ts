import { PessoaService } from '../pessoa.service';

import { IsDocumentoConstraint } from './is-documento-unique.validation';

describe('IsDocumentoConstraint', () => {
  let constraint: IsDocumentoConstraint;
  let service: PessoaService;

  beforeEach(() => {
    service = new PessoaService(null);
    constraint = new IsDocumentoConstraint(service);
  });

  describe('validate', () => {
    it('should return true if PessoaService.findByDocumento returns null', async () => {
      const documento = '12345678901';
      jest.spyOn(service, 'findByDocumento').mockResolvedValueOnce(null);

      const result = await constraint.validate(documento);

      expect(service.findByDocumento).toHaveBeenCalledWith(documento);
      expect(result).toBe(true);
    });

    it('should return false if PessoaService.findByDocumento returns a PessoaEntity', async () => {
      const documento = '12345678901';
      jest.spyOn(service, 'findByDocumento').mockResolvedValueOnce({} as any);

      const result = await constraint.validate(documento);

      expect(service.findByDocumento).toHaveBeenCalledWith(documento);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const result = constraint.defaultMessage();

      expect(result).toBe(`Documento já vinculado a outra pessoa`);
    });
  });
});
