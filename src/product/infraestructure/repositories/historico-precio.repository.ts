import { DataSource, Repository } from "typeorm";
import { HistoricoPrecio } from "../entities/historico-precio.entity";
import { Result } from "src/common/domain/result-handler/Result";

export class HistoricoPrecioRepository extends Repository<HistoricoPrecio>{

    constructor(dataSource: DataSource) {
        super(HistoricoPrecio, dataSource.createEntityManager());
    }

    async saveHistorico(historico: HistoricoPrecio): Promise<Result<HistoricoPrecio>>{
        try
        {
            const resultado = await this.save(historico)
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }

}