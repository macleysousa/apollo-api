import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/storage/storage.service';

import { ReferenciaService } from '../referencia.service';

import { UpdateMediaDto } from './dto/update-media.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { ReferenciaMediaEntity } from './entities/referencia-media.entity';

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

  private async clearOtherDefaults(referenciaId: number, mediaId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(ReferenciaMediaEntity)
      .set({ isDefault: false })
      .where('referenciaId = :referenciaId', { referenciaId })
      .andWhere('id <> :mediaId', { mediaId })
      .andWhere('isDefault = :isDefault', { isDefault: true })
      .execute();
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
          cor: dto.cor,
          tamanho: dto.tamanho,
        }),
      );

      if (media.isDefault) {
        await this.clearOtherDefaults(referenciaId, media.id);
      }
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

  async update(referenciaId: number, id: number, dto: UpdateMediaDto): Promise<ReferenciaMediaEntity> {
    const media = await this.findById(referenciaId, id);

    if (!media) {
      throw new BadRequestException('Mídia não encontrada');
    }

    const isDefault = dto.isDefault === undefined ? media.isDefault : this.normalizeBoolean(dto.isDefault, false);
    const isPublic = dto.isPublic === undefined ? media.isPublic : this.normalizeBoolean(dto.isPublic, false);

    await this.repository.save({
      ...media,
      type: dto.type ?? media.type,
      isDefault,
      isPublic,
      description: dto.description ?? media.description,
      cor: dto.cor ?? media.cor,
      tamanho: dto.tamanho ?? media.tamanho,
    });

    if (isDefault) {
      await this.clearOtherDefaults(referenciaId, id);
    }

    return this.findById(referenciaId, id);
  }

  async delete(referenciaId: number, id: number): Promise<void> {
    const media = await this.findById(referenciaId, id);
    if (media) {
      await this.storage.delete(media.url);
      await this.repository.delete(id);
    }
  }
}
