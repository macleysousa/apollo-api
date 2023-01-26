import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { BarcodeEntity } from './entities/barcode.entity';

@Injectable()
export class BarcodeService {
  constructor(
    @InjectRepository(BarcodeEntity)
    private repository: Repository<BarcodeEntity>
  ) {}

  async create(productId: number, { barcode }: CreateBarcodeDto): Promise<void> {
    await this.repository.upsert({ productId, code: barcode }, { conflictPaths: ['productId', 'code'] });
  }

  async remove(productId: number, barcode: string): Promise<void> {
    await this.repository.delete({ productId, code: barcode });
  }
}
