import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreateHistoricoPrecioServiceEntryDTO } from "../DTO/entry/create-historico-precio-service-entry.dto";
import { CreateHistoricoPrecioServiceResponseDTO } from "../DTO/response/create-historico-precio-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { HistoricoPrecioRepository } from "../../repositories/historico-precio.repository";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { HistoricoPrecio } from "../../entities/historico-precio.entity";
import { OrmMoneda } from "../../entities/moneda.entity";
import { OrmProductRepository } from "../../repositories/product-repository";
import { MonedaRepository } from "../../repositories/moneda.repository";

export class CreateHistoricoPrecioService implements IApplicationService
<CreateHistoricoPrecioServiceEntryDTO,
CreateHistoricoPrecioServiceResponseDTO>{

    constructor(
        private readonly historicoRepository: HistoricoPrecioRepository,
        private readonly monedaRepository: MonedaRepository,
        private readonly productoRepository: OrmProductRepository,
        private readonly idGenerator: IdGenerator<string>
    ){
        this.historicoRepository = historicoRepository
        this.idGenerator = idGenerator
        this.productoRepository = productoRepository
        this.monedaRepository = monedaRepository
    }

    async execute(data: CreateHistoricoPrecioServiceEntryDTO): Promise<Result<CreateHistoricoPrecioServiceResponseDTO>> {
        
        const moneda = OrmMoneda.create(
            await this.idGenerator.generateId(),
            data.moneda,
            data.moneda,
        )
        
        const ormMoneda = await this.monedaRepository.save(moneda)

        const producto = await this.productoRepository.findOneBy( { id: data.id_producto } )

        const historicoPrecio = HistoricoPrecio.create(
            await this.idGenerator.generateId(),
            new Date(),
            data.precio,
            ormMoneda,
            producto,
            null
        )

        const result = await this.historicoRepository.saveHistorico(historicoPrecio)

        if (!result.isSuccess())
            return Result.fail(new Error("Historico no creado"), 404, "Historico no creado")

        const response: CreateHistoricoPrecioServiceResponseDTO = {
            id: result.Value.id,
        }
        
        return Result.success(response,200)
    }
    get name(): string {
        return this.constructor.name
    }
    
}