import { IsUserNameValidConstraint } from './is-username.validation';

describe('Validation username', () => {
    let isUserNameValidConstraint: IsUserNameValidConstraint;

    beforeEach(async () => {
        isUserNameValidConstraint = new IsUserNameValidConstraint();
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
