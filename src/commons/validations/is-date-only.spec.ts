import { validate, ValidationArguments } from 'class-validator';

import { IsDateOnly, IsDateOnlyConstraint } from './is-date-only';

describe('IsDateOnlyConstraint', () => {
  let constraint: IsDateOnlyConstraint;

  beforeEach(() => {
    constraint = new IsDateOnlyConstraint();
  });

  it('should validate a correct date in YYYY-MM-DD format', () => {
    const result = constraint.validate('2023-10-01', {} as ValidationArguments as ValidationArguments);
    expect(result).toBe(true);
  });

  it('should fail validation for an invalid date', () => {
    const result = constraint.validate('2023-02-30', {} as ValidationArguments);
    expect(result).toBe(false);
  });

  it('should fail validation for a non-date string', () => {
    const result = constraint.validate('not-a-date', {} as ValidationArguments);
    expect(result).toBe(false);
  });
});

class TestClass {
  @IsDateOnly({ message: 'O valor deve ser uma data válida no formato YYYY-MM-DD.' })
  date!: string;
}

describe('IsDateOnly', () => {
  it('should validate a correct date in YYYY-MM-DD format', async () => {
    const instance = new TestClass();
    instance.date = '2023-10-01';

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for an invalid date', async () => {
    const instance = new TestClass();
    instance.date = '2023-02-30';

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});
