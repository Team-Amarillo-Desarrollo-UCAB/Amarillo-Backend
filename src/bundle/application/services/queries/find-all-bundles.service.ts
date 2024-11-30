import { IBundleRepository } from 'src/bundle/domain/repositories/bundle-repository.interface';
import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/Result';
import { GetAllBundlesServiceEntryDTO } from '../../dto/entry/get-all-bundles-service-entry.dto';
import { GetAllBundlesServiceResponseDTO } from '../../dto/response/get-all-bundles-service-response.dto';


export class FindAllBundlesApplicationService
  implements IApplicationService<GetAllBundlesServiceEntryDTO, GetAllBundlesServiceResponseDTO[]>//array porque devuelve una coleccion de categorias
{
  private readonly bundleRepository: IBundleRepository;

  constructor(bundleRepository: IBundleRepository) {
    this.bundleRepository = bundleRepository;
  }

  async execute(data: GetAllBundlesServiceEntryDTO): Promise<Result<GetAllBundlesServiceResponseDTO[]>> {
    data.page = data.page * data.perpage - data.perpage;
    const bundlesResult = await this.bundleRepository.findAllBundles(data.page, data.perpage, data.category, data.name, data.price, data.popular, data.discount);

    

    if (!bundlesResult.isSuccess()) {
      // Devolver un fallo si algo sale mal en el repositorio
      return Result.fail(new Error("ERROR al hallar"),500,"ERROR al hallar");
    }

    const response: GetAllBundlesServiceResponseDTO[] = []

    const bundlesDto = bundlesResult.Value.map(async(bundle) => response.push({
        //en endpoint comun no se define la colección de productos y/o categorías en el response...
        id:bundle.Id.Value,
        name: bundle.name.Value,
        images: bundle.images.map(i => i.Value),
        price: bundle.price.Price,
        currency:bundle.price.Currency,
        weight: bundle.weight.Weight,
        measurement:bundle.weight.Measurement,
        stock:bundle.stock.Value,
        //discount
    }));

    return Result.success(response, 202);
  }

  get name(): string {
    return this.constructor.name;
  }
}