import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBetweenPipe implements PipeTransform<number, Promise<number>> {
  constructor(private readonly min: number, private readonly max: number) {}

  async transform(value: number): Promise<number> {
    if (value < this.min || value > this.max) {
      throw new BadRequestException(`O valor deve estar entre ${this.min} e ${this.max}`);
    }

    return value;
  }
}
