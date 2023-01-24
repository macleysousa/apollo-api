import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeasurementUnitService } from './measurement-unit.service';
import { MeasurementUnitController } from './measurement-unit.controller';
import { MeasurementUnitEntity } from './entities/measurement-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnitEntity])],
  controllers: [MeasurementUnitController],
  providers: [MeasurementUnitService],
})
export class MeasurementUnitModule {}
