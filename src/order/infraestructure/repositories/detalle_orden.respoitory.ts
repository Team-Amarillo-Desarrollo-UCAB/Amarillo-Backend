import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/domain/result-handler/Result";
import { Detalle_Orden } from "../entites/detalle_orden.entity";

export class DetalleRepository extends Repository<Detalle_Orden>{

    constructor(dataSource: DataSource) {
        super(Detalle_Orden, dataSource.createEntityManager());
    }

    async saveDetalle(detalle: Detalle_Orden): Promise<Result<Detalle_Orden>>{
        try
        {
            const resultado = await this.save(detalle)
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }

}