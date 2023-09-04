describe('orm configuration', () => {
  let DB_USERNAME: string;

  beforeAll(() => {
    DB_USERNAME = process.env.DB_USERNAME;
  });

  afterAll(() => {
    process.env.DB_USERNAME = DB_USERNAME;
  });

  it('should fail to instantiate module orm configuration with error *Database variable DB_* has not been set properly.*', () => {
    // Arrange
    process.env.DB_USERNAME = '';

    try {
      // Act
      require('./orm.config');
    } catch (e) {
      // Assert
      expect(e).toEqual(new Error('Database variable DB_* has not been set properly'));
    }
  });

  it('should success to instantiate module orm configuration default env', () => {
    // Arrange
    process.env.DB_USERNAME = 'DB_USERNAME';
    process.env.DB_PORT = '';
    process.env.DB_TIMEZONE = '';

    // Act
    const orm = require('./orm.config');

    // Assert
    expect(orm).not.toEqual(null);
    jest.resetModules();
  });

  it('should success to instantiate module orm configuration', () => {
    // Arrange
    process.env.DB_USERNAME = 'DB_USERNAME';
    process.env.ORM_LOGGING = 'false';

    // Act
    const orm = require('./orm.config');

    // Assert
    expect(orm).not.toEqual(null);
  });
});
