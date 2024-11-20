describe('crypto', () => {
  let SECRET_KEY: string;

  beforeAll(() => {
    SECRET_KEY = process.env.SECRET_KEY;
  });

  afterAll(() => {
    process.env.SECRET_KEY = SECRET_KEY;
  });

  it('should fail to instantiate module crypto with error *secret key not declared*', async () => {
    // Arrange
    process.env.SECRET_KEY = '';

    try {
      // Act
      await import('./crypto');
    } catch (e) {
      // Assert
      expect(e).toEqual(new Error('secret key not declared'));
    }
  });

  it('should succeed when encrypting', async () => {
    // Arrange
    const text = 'apollo-api';
    process.env.SECRET_KEY = 'apollo';

    const crypto = await import('./crypto');

    // Act
    const response = crypto.encrypt(text);

    // Assert
    expect(response).not.toEqual('');
  });

  it('should succeed when decrypting', async () => {
    // Arrange
    const text = 'U2FsdGVkX19amOOThQyKd/Tx33RtO6kx26CrH/uLRk0=';
    process.env.SECRET_KEY = 'apollo';

    const crypto = await import('./crypto');

    // Act
    const response = crypto.decrypt(text);

    // Assert
    expect(response).toEqual('apollo-api');
  });

  it('should fail when decrypting', async () => {
    // Arrange
    const text = 'apollo-api';
    process.env.SECRET_KEY = 'apollo';

    jest.resetModules();

    const crypto = await import('./crypto');
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
