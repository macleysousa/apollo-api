describe('crypto', () => {
  let SECRET_KEY: string;

  beforeAll(() => {
    SECRET_KEY = process.env.SECRET_KEY;
  });

  afterAll(() => {
    process.env.SECRET_KEY = SECRET_KEY;
  });

  it('should fail to instantiate module crypto with error *secret key not declared*', () => {
    // Arrange
    process.env.SECRET_KEY = '';

    try {
      // Act
      require('./crypto');
    } catch (e) {
      // Assert
      expect(e).toEqual(new Error('secret key not declared'));
    }
  });

  it('should succeed when encrypting', () => {
    // Arrange
    const text = 'apollo-api';
    process.env.SECRET_KEY = 'apollo';

    const crypto = require('./crypto');

    // Act
    const response = crypto.encrypt(text);

    // Assert
    expect(response).not.toEqual(null || '');
  });

  it('should succeed when decrypting', () => {
    // Arrange
    const text = 'U2FsdGVkX19amOOThQyKd/Tx33RtO6kx26CrH/uLRk0=';
    process.env.SECRET_KEY = 'apollo';

    const crypto = require('./crypto');

    // Act
    const response = crypto.decrypt(text);

    // Assert
    expect(response).toEqual('apollo-api');
  });

  it('should fail when decrypting', () => {
    // Arrange
    const text = 'apollo-api';
    process.env.SECRET_KEY = 'apollo';

    jest.resetModules();

    const crypto = require('./crypto');
    jest.mock('crypto-js', () => {
      return {
        AES: jest.fn().mockImplementation(() => {
          return {
            encrypt: jest.fn(),
          };
        }),
      };
    });

    // Act
    const response = crypto.decrypt(text);

    // Assert
    expect(response).toEqual(null);
  });
});
