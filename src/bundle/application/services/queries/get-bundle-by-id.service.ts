import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { GetBundleByIdServiceEntryDTO } from "../../dto/entry/get-bundle-by-id-service-entry.dto";
import { GetBundleByIdServiceResponseDTO } from "../../dto/response/get-bundle-by-id-service-response.dto";

export class GetBundleByIdService implements IApplicationService<GetBundleByIdServiceEntryDTO, GetBundleByIdServiceResponseDTO> {
    
    private readonly bundleRepository: IBundleRepository;

    constructor(bundleRepository: IBundleRepository) {
        this.bundleRepository = bundleRepository;
    }
    
    async execute(data: GetBundleByIdServiceEntryDTO): Promise<Result<GetBundleByIdServiceResponseDTO>> {
        const bundle = await this.bundleRepository.findBundleById(data.id_bundle);

        if (!bundle.isSuccess()) {
            return Result.fail(new Error("Bundle no encontrado"), 404, "Bundle no encontrado");
        }

        const response: GetBundleByIdServiceResponseDTO = {
            id: bundle.Value.Id.Value,
            name: bundle.Value.name.Value,
            description: bundle.Value.description.Value,
            images: bundle.Value.images.map(i => i.Value),
            price: bundle.Value.price.Price,
            currency:bundle.Value.price.Currency,
            weight:bundle.Value.weight.Weight,
            measurement:bundle.Value.weight.Measurement,
            stock:bundle.Value.stock.Value,
            category:bundle.Value.categories.map(i => i.Value),
            productId:bundle.Value.products.map(i => i.Id),
            caducityDate:bundle.Value.caducityDate.Value,
        };

        return Result.success(response, 202);
    }

    get name(): string {
        return this.constructor.name;
    }
}
