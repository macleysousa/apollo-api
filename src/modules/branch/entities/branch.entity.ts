import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'branches' })
export class BranchEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    cnpj: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    fantasyName: string;

    @ApiProperty()
    @Column()
    isInactive: boolean;

    @ApiProperty({ enum: UF, default: UF.NotInformed })
    @Column()
    uf: UF;

    @ApiProperty()
    @Column()
    numberStateRegistration: string;

    @ApiProperty()
    @Column()
    codeActivity: string;

    @ApiProperty()
    @Column()
    codeActivityCnae: string;

    @ApiProperty({ enum: TaxRegime, default: TaxRegime.NotInformed })
    @Column()
    typeTaxRegime: TaxRegime;

    @ApiProperty({ enum: SubTributary, default: SubTributary.NotInformed })
    @Column()
    typeSubTributary: SubTributary;

    @ApiProperty()
    @Column()
    suframaCode: string;

    @ApiProperty()
    @Column()
    registrationMunicipal: string;

    @ApiProperty()
    @Column()
    phone: string;

    @ApiProperty()
    @Column()
    email: string;

    constructor(partial?: Partial<BranchEntity>) {
        super();
        Object.assign(this, partial);
    }
}
