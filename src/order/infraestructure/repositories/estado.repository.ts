import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/domain/result-handler/Result";
import { EnumOrderEstados } from "src/order/domain/order-estados-enum";
import { Estado } from "../entites/Estado-orden/estado.entity";

export class EstadoRepository extends Repository<Estado>{

    constructor(dataSource: DataSource) {
        super(Estado, dataSource.createEntityManager());
    }

    async findByName(nombre: EnumOrderEstados): Promise<Result<Estado>>{
        try
        {
            const resultado = await this.findOne({
                where: { nombre: nombre }
            });
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }

}