import { IsNotEmpty, IsString } from 'class-validator';

import { validateDto } from './validate-dto';

class TestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

describe('validateDto', () => {
  it('should return an empty array if the object is valid', async () => {
    const object = { name: 'Test' };
    const errors = await validateDto(TestDto, object);

    expect(errors).toEqual([]);
  });

  it('should return an array of validation errors if the object is invalid', async () => {
    const object = { name: '' };
    const errors = await validateDto(TestDto, object);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should return an empty array if the array of objects is valid', async () => {
    const objects = [{ name: 'Test 1' }, { name: 'Test 2' }];
    const errors = await validateDto(TestDto, objects);

    expect(errors).toEqual([]);
  });

  it('should return an array of validation errors if the array of objects is invalid', async () => {
    const objects = [{ name: 'Test 1' }, { name: '' }];
    const errors = await validateDto(TestDto, objects);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
