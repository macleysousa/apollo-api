import { IsCnpjValidConstraint } from './is-cnpj.validation';

describe('CNPJ validation', () => {
  let isCnpjValidConstraint: IsCnpjValidConstraint;

  beforeEach(() => {
    isCnpjValidConstraint = new IsCnpjValidConstraint();
  });
  describe('validate', () => {
    it('should validate a valid CNPJ', async () => {
      // Arrange
      const cnpj = '49.969.947/0001-02';

      // Act
      const result = await isCnpjValidConstraint.validate(cnpj);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should invalidate a valid CNPJ with sum digits < 2', async () => {
      // Arrange
      const cnpj = '49.969.947/0001-02';

      // Act
      const result = await isCnpjValidConstraint.validate(cnpj);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid CNPJ', async () => {
      // Arrange
      const cnpj = '01.248.473/0001-74';

      // Act
      const result = await isCnpjValidConstraint.validate(cnpj);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should validate a CNPJ with size', async () => {
      // Arrange
      const cnpj = '0000';

      // Act
      const result = await isCnpjValidConstraint.validate(cnpj);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Act
      const result = isCnpjValidConstraint.defaultMessage();

      // Assert
      expect(result).toEqual('cnpj is incorrect or in an invalid format');
    });
  });
});
