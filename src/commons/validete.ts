import { plainToClass, ClassConstructor } from 'class-transformer';
import { ValidationError, ValidatorOptions, validate } from 'class-validator';

interface Options extends ValidatorOptions {
  ignoreProperties?: string[];
}

export async function validateDto<T, V>(cls: ClassConstructor<T>, object: V | V[], options?: ValidatorOptions): Promise<ValidationError[]> {
  if (Array.isArray(object)) {
    const results = await Promise.all(object.map((o) => validateDto(cls, o, options)));
    return results.flat();
  } else {
    return validate(plainToClass(cls, object) as any, options);
  }
}
