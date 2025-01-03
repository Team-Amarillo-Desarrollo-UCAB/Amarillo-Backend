import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { Moneda } from "src/product/domain/enum/Monedas"
import { HistoricoPrecio } from "src/product/infraestructure/entities/historico-precio.entity"
import { OrmMoneda } from "src/product/infraestructure/entities/moneda.entity"
import { HistoricoPrecioRepository } from "src/product/infraestructure/repositories/historico-precio.repository"
import { MonedaRepository } from "src/product/infraestructure/repositories/moneda.repository"
import { OrmProductRepository } from "src/product/infraestructure/repositories/product-repository"
import { CreateHistoricoPrecioServiceEntryDTO } from "src/product/infraestructure/services/DTO/entry/create-historico-precio-service-entry.dto"
import { CreateHistoricoPrecioServiceResponseDTO } from "src/product/infraestructure/services/DTO/response/create-historico-precio-service-response.dto"


export class CreateHistoricoPrecioService implements IApplicationService
    <CreateHistoricoPrecioServiceEntryDTO,
        CreateHistoricoPrecioServiceResponseDTO> {

    constructor(
        private readonly historicoRepository: HistoricoPrecioRepository,
        private readonly monedaRepository: MonedaRepository,
        private readonly productoRepository: OrmProductRepository,
        private readonly idGenerator: IdGenerator<string>
    ) {
        this.historicoRepository = historicoRepository
        this.idGenerator = idGenerator
        this.productoRepository = productoRepository
        this.monedaRepository = monedaRepository
    }

    async execute(data: CreateHistoricoPrecioServiceEntryDTO): Promise<Result<CreateHistoricoPrecioServiceResponseDTO>> {

        const find_moneda = await this.monedaRepository.findMoneda(data.moneda as Moneda)

        if(!find_moneda.isSuccess())
            return Result.fail<CreateHistoricoPrecioServiceResponseDTO>(find_moneda.Error,find_moneda.StatusCode,find_moneda.Message)

        const moneda = find_moneda.Value

        const producto = await this.productoRepository.findOneBy({ id: data.id_producto })

        const historicoPrecio = HistoricoPrecio.create(
            await this.idGenerator.generateId(),
            new Date(),
            data.precio,
            moneda,
            producto,
            null
        )

        const result = await this.historicoRepository.saveHistorico(historicoPrecio)

        if (!result.isSuccess())
            return Result.fail(new Error("Historico no creado"), 404, "Historico no creado")

        const response: CreateHistoricoPrecioServiceResponseDTO = {
            id: result.Value.id,
        }

        return Result.success(response, 200)
    }
    get name(): string {
        return this.constructor.name
    }

}