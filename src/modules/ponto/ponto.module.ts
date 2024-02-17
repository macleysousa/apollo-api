import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PontoEntity } from "./entities/ponto.entity";
import { PontoController } from "./ponto.controller";
import { PontoService } from "./ponto.service";

@Module({
    imports: [TypeOrmModule.forFeature([PontoEntity]), PontoModule.forRoot(),],
    controllers: [PontoController],
    providers: [PontoService],
    exports: [PontoService],
})

export class PontoModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: this,
        };
    }

}

