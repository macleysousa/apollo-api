import { Injectable } from '@nestjs/common';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';

@Injectable()
export class BarcodeService {
  create(createBarcodeDto: CreateBarcodeDto) {
    return 'This action adds a new barcode';
  }

  findAll() {
    return `This action returns all barcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} barcode`;
  }

  update(id: number, updateBarcodeDto: UpdateBarcodeDto) {
    return `This action updates a #${id} barcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} barcode`;
  }
}
