import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/storage/storage.service';

import { UploadMediaDto } from './dto/upload-media.dto';
import { ReferenciaMediaEntity } from './entities/referencia-media.entity';

@Injectable()
export class ReferenciaMediaService {
  constructor(
    @InjectRepository(ReferenciaMediaEntity)
    private readonly repository: Repository<ReferenciaMediaEntity>,
    private readonly storage: StorageService,
  ) {}

  async upload(referenciaId: number, file: Express.Multer.File, dto: UploadMediaDto): Promise<ReferenciaMediaEntity> {
    const path = await this.storage.upload('referencias', file);

    const media = this.repository.create({
      referenciaId,
      type: dto.type,
      url: path,
      isDefault: dto.isDefault ?? false,
      isPublic: dto.isPublic ?? false,
    });

    return this.findById(referenciaId, media.id);
  }

  async find(referenciaId: number): Promise<ReferenciaMediaEntity[]> {
    return this.repository.find({ where: { referenciaId } });
  }

  async findById(referenciaId: number, id: number): Promise<ReferenciaMediaEntity> {
    return this.repository.findOne({ where: { id, referenciaId } });
  }

  async delete(referenciaId: number, id: number): Promise<void> {
    const media = await this.findById(referenciaId, id);
    if (media) {
      await this.storage.delete(media.url);
      await this.repository.delete(id);
    }
  }
}
