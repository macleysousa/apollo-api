import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceController } from './reference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceEntity } from './entities/reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceEntity])],
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
