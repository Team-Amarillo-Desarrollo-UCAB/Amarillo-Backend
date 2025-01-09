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
        const bundle = await this.bundleRepository.findBundleById(data.id);

        if (!bundle.isSuccess()) {
            return Result.fail(new Error("Bundle no encontrado"), 404, "Bundle no encontrado");
        }

        const response: GetBundleByIdServiceResponseDTO = {
            id: bundle.Value.Id.Value,
            name: bundle.Value.name.Value,
            description: bundle.Value.description.Value,
            images: bundle.Value.images.map(i => i.Value),
            price: Number(bundle.Value.price.Price),
            currency:bundle.Value.price.Currency,
            weight:Number(bundle.Value.weight.Weight),
            measurement:bundle.Value.weight.Measurement,
            stock:bundle.Value.stock.Value,
            categories:bundle.Value.categories.map(i => i.Value),
            products:bundle.Value.products.map(i => i.Id),
            caducityDate: bundle.Value.caducityDate && bundle.Value.caducityDate.Value 
        ? bundle.Value.caducityDate.Value 
        : new Date('2029-01-01'),
        discount: bundle.Value.Discount && bundle.Value.Discount.Value 
        ? bundle.Value.Discount.Value 
        : ""
        };

        return Result.success(response, 202);
    }

    get name(): string {
        return this.constructor.name;
    }
}
