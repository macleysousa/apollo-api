import { ApiProperty } from "@nestjs/swagger";
import { PrimaryColumn, UpdateDateColumn } from "typeorm";

export class PontoDTO {
    @ApiProperty()
    @PrimaryColumn('int')
    empresaId?: number;

    @ApiProperty({ required: true })
    @PrimaryColumn('int')
    clienteId?: number;

    @ApiProperty()
    @UpdateDateColumn()
    dataDeValidade: Date;

    @ApiProperty()
    @UpdateDateColumn({ default: 'now()' })
    dataDeCriacao?: Date;

}