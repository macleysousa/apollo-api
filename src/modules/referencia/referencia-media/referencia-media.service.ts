import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/storage/storage.service';

import { UploadMediaDto } from './dto/upload-media.dto';
import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaService } from '../referencia.service';

@Injectable()
export class ReferenciaMediaService {
  constructor(
    @InjectRepository(ReferenciaMediaEntity)
    private readonly repository: Repository<ReferenciaMediaEntity>,
    private readonly storage: StorageService,
    private readonly referenciasService: ReferenciaService,
  ) {}

  private normalizeBoolean(value: unknown, fallback = false): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1') {
        return true;
      }

      if (normalized === 'false' || normalized === '0') {
        return false;
      }
    }

    if (value === undefined || value === null) {
      return fallback;
    }

    return Boolean(value);
  }

  async upload(referenciaId: number, file: Express.Multer.File, dto: UploadMediaDto): Promise<ReferenciaMediaEntity> {
    const path = await this.storage.upload('referencias', file);

    let media: ReferenciaMediaEntity;

    var referencia = await this.referenciasService.findById(referenciaId);
    if (!referencia) {
      throw new BadRequestException('Referencia não encontrada');
    }
    try {
      media = await this.repository.save(
        this.repository.create({
          referenciaId,
          type: dto.type,
          url: path,
          isDefault: this.normalizeBoolean(dto.isDefault, false),
          isPublic: this.normalizeBoolean(dto.isPublic, false),
          description: dto.description,
        }),
      );
    } catch (error) {
      await this.storage.delete(path).catch(() => undefined);
      throw error;
    }

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
