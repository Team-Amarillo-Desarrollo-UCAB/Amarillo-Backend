import { Result } from "src/common/domain/result-handler/Result";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { Estado } from "src/order/infraestructure/entites/Estado-orden/estado.entity";

export class EstadoRepositoryMock{

    private readonly estados: Estado[] = []

    async save(estado: Estado): Promise<Result<Estado>>{
        this.estados.push(estado)
        return Result.success(estado,200)
    }

    async findByName(nombre: EnumOrderEstados): Promise<Result<Estado>>{
        try
        {
            const resultado = await this.estados.find(
                estado => estado.nombre === nombre
            );
            return Result.success( resultado, 200 )
        } catch ( error )
        {
            return Result.fail( new Error( error.message ), error.code, error.message )

        }
    }

}