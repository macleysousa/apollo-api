import { IsUsuarioValidConstraint } from './is-usuario.validation';

describe('Validation username', () => {
  let isUserNameValidConstraint: IsUsuarioValidConstraint;

  beforeEach(async () => {
    isUserNameValidConstraint = new IsUsuarioValidConstraint();
  });

  describe('validate', () => {
    it('should validate username return *true*', async () => {
      // Arrange

      // Act
      const response = await isUserNameValidConstraint.validate('app');

      // Assert
      expect(response).toEqual(true);
    });

    it('should validate username return *false*', async () => {
      // Arrange

      // Act
      const response = await isUserNameValidConstraint.validate('app error');

      // Assert
      expect(response).toEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should validate username return *invalid name format*', async () => {
      // Arrange

      // Act
      const response = isUserNameValidConstraint.defaultMessage();

      // Assert
      expect(response).toEqual('invalid name format');
    });
  });
});
