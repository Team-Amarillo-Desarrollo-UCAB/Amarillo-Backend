import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/domain/result-handler/Result";
import { OrmMoneda } from "../entities/moneda.entity";
import { Moneda } from "src/product/domain/enum/Monedas";

export class MonedaRepository extends Repository<OrmMoneda> {

    constructor(dataSource: DataSource) {
        super(OrmMoneda, dataSource.createEntityManager());
    }

    async saveMoneda(moneda: OrmMoneda): Promise<Result<OrmMoneda>> {
        try {
            const resultado = await this.save(moneda)
            return Result.success(resultado, 200)
        } catch (error) {
            return Result.fail(new Error(error.message), error.code, error.message)

        }
    }

    async findMoneda(currency: Moneda): Promise<Result<OrmMoneda>> {
        try {
            const moneda = await this.findOneBy({ simbolo: currency })

        } catch (error) {
            return Result.fail(new Error("Error al buscar la moneda"), 500, "Error al buscar la moneda")
        }
    }

}