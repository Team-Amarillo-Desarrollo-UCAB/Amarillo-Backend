import { DataSource, Repository } from "typeorm";
import { Estado_Orden } from "../entites/Estado-orden/estado_orden.entity";
import { Result } from "src/common/domain/result-handler/Result";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { Estado } from "../entites/Estado-orden/estado.entity";

export class EstadoOrdenRepository extends Repository<Estado_Orden>{

    constructor(dataSource: DataSource) {
        super(Estado_Orden, dataSource.createEntityManager());
    }

    async saveEstadoOrden(estado_orden: Estado_Orden): Promise<Result<Estado_Orden>>{
        try
        {
            const resultado = await this.save(estado_orden)
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            console.log(error.message)
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }
}