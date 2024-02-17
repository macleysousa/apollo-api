import { InjectRepository } from "@nestjs/typeorm";
import { PontoEntity } from "./entities/ponto.entity";
import { In, IsNull, Not, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProdutoEntity } from "../produto/entities/produto.entity";
import { PontoDTO } from "./dto/ponto.dto";

interface filter {
    clienteId: number,
    dataDeValidade: Date,
}
@Injectable()
export class PontoService {

    constructor(
        @InjectRepository(PontoEntity)
        private repository: Repository<PontoEntity>,
    ) {}

    async find(filter?: filter): Promise<Array<PontoEntity>> {
        const queryBuilder = this.repository.createQueryBuilder('findPoints');
        queryBuilder.where({ clientId: Not(IsNull()) });

        if (filter?.clienteId && filter.clienteId > 0) {
            queryBuilder.andWhere({ clientId: filter.clienteId });
        }
        if (filter?.dataDeValidade) {
            queryBuilder.andWhere({ dataDeValidade: filter.dataDeValidade });
        }
        return queryBuilder.getMany();

    }

    async findById(pontoId: number): Promise<PontoEntity> {
        return this.repository.findOneBy({ id: pontoId });
    }

    async create(pontoDTO: PontoDTO): Promise<PontoEntity> {
        const product = await this.repository.save(pontoDTO);
        return this.findById(product.id);
    }
}