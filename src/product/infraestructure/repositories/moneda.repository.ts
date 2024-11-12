import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/domain/result-handler/Result";
import { OrmMoneda } from "../entities/moneda.entity";

export class MonedaRepository extends Repository<OrmMoneda>{

    constructor(dataSource: DataSource) {
        super(OrmMoneda, dataSource.createEntityManager());
    }

    async saveMoneda(moneda: OrmMoneda): Promise<Result<OrmMoneda>>{
        try
        {
            const resultado = await this.save(moneda)
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }

}