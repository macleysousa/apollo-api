import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, isNotEmpty } from "class-validator";
import { PrimaryColumn, UpdateDateColumn } from "typeorm";

export class PontoDTO {
    @ApiProperty()
    @IsNotEmpty()
    empresaId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    //TODO: Criar o IsCliente()
    pessoaId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    quantidade: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    dataDeValidade: Date;

}