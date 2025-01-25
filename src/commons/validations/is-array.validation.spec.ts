import { IsArrayConstraint } from './is-array.validation';

describe('IsArrayConstraint', () => {
  let isArrayConstraint: IsArrayConstraint;

  beforeEach(() => {
    isArrayConstraint = new IsArrayConstraint();
  });

  it('should be defined', () => {
    expect(isArrayConstraint).toBeDefined();
  });

  describe('validate', () => {
    it('should return false for invalid array', async () => {
      const args = { constraints: ['number'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate('teste', args);

      expect(isValid).toBe(false);
    });

    it('should validate number array correctly', async () => {
      const args = { constraints: ['number'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['1.0', '2.2', '3.5'], args);
      expect(isValid).toBe(true);
    });

    it('should validate int array correctly', async () => {
      const args = { constraints: ['int'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate([1, 2, 3], args);

      expect(isValid).toBe(true);
    });

    it('should validate string array correctly', async () => {
      const args = { constraints: ['string'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['a', 'b', 'c'], args);

      expect(isValid).toBe(true);
    });

    it('should validate enum array correctly', async () => {
      enum TestEnum {
        A = 'A',
        B = 'B',
        C = 'C',
      }
      const args = { constraints: ['enum', TestEnum], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['A', 'B', 'C'], args);

      expect(isValid).toBe(true);
    });

    it('should validate uuid array correctly', async () => {
      const args = { constraints: ['uuid'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'], args);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid number array', async () => {
      const args = { constraints: ['int'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['1', '2', 'C'], args);
      expect(isValid).toBe(false);
    });

    it('should return false for invalid int array', async () => {
      const args = { constraints: ['int'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['1.1', '2.0', '0.3'], args);
      expect(isValid).toBe(false);
    });

    it('should return false for invalid string array', async () => {
      const args = { constraints: ['string'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate([1, 2, 3], args);
      expect(isValid).toBe(false);
    });

    it('should return false for invalid enum array', async () => {
      enum TestEnum {
        A = 'A',
        B = 'B',
        C = 'C',
      }
      const args = { constraints: ['enum', TestEnum], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['D', 'E', 'F'], args);
      expect(isValid).toBe(false);
    });

    it('should return false for enum array without options', async () => {
      const args = { constraints: ['enum'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['D', 'E', 'F'], args);
      expect(isValid).toBe(false);
    });

    it('should return false for invalid uuid array', async () => {
      const args = { constraints: ['uuid'], object: { property: 'test' } } as any;

      const isValid = await isArrayConstraint.validate(['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1'], args);
      expect(isValid).toBe(false);
    });

    it('should return true for undefined type and is array', async () => {
      const args = { constraints: [], object: { property: 'test' } } as any;

      const response = await isArrayConstraint.validate(['a0eebc99'], args);
      expect(response).toBe(true);
    });

    it('should return false for undefined type and not array', async () => {
      const args = { constraints: [], object: { property: 'test' } } as any;

      const response = await isArrayConstraint.validate('a0eebc99', args);
      expect(response).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return invalid message for number', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['number'], value: [] } as any);
      expect(message).toBe('each value in $property must be a number');
    });

    it('should return invalid message for int', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['int'], value: [] } as any);
      expect(message).toBe('each value in $property must be an integer number');
    });

    it('should return invalid message for string', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['string'], value: [] } as any);
      expect(message).toBe('each value in $property must be a string');
    });

    it('should return invalid message for enum without options', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['enum'], value: [] } as any);
      expect(message).toBe('Enum options must be provided');
    });

    it('should return invalid message for enum with options', () => {
      enum TestEnum {
        A = 'A',
        B = 'B',
        C = 'C',
      }
      const message = isArrayConstraint.defaultMessage({ constraints: ['enum', TestEnum], value: [] } as any);
      expect(message).toBe('each value in $property must be one of the following values: A, B, C');
    });

    it('should return invalid message for uuid', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['uuid'], value: [] } as any);
      expect(message).toBe('each value in $property must be a valid uuid');
    });

    it('should return invalid message for undefined type', () => {
      const message = isArrayConstraint.defaultMessage({ constraints: ['invalid'], value: [] } as any);
      expect(message).toBe('The value must be an array');
    });
  });
});
