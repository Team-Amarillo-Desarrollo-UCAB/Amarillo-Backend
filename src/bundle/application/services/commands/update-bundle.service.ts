// import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
// import { IApplicationService } from "src/common/application/application-services/application-service.interface";
// import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
// import { Result } from "src/common/domain/result-handler/Result";
// import { UpdateBundleServiceEntryDto } from "../../dto/entry/update-bundle-service-entry.dto";
// import { UpdateBundleServiceResponseDto } from "../../dto/response/update-bundle-service-response.dto";


// export class UpdateBundleApplicationService 
//   implements IApplicationService<UpdateBundleServiceEntryDto, UpdateBundleServiceResponseDto> {
  
//   private readonly bundleRepository: IBundleRepository;
//   private readonly eventHandler: IEventHandler;

//   constructor(
//     bundleRepository: IBundleRepository,
//     eventHandler: IEventHandler
//   ) {
//     this.bundleRepository = bundleRepository;
//     this.eventHandler = eventHandler;
//   }

//   async execute(data: UpdateBundleServiceEntryDto): Promise<Result<UpdateBundleServiceResponseDto>> {
//     // Paso 1: Obtener todos los bundles desde el repositorio
//     const page=1
//     const perpage=10

//     if(data.name){

//     }

//     if (!bundlesResult.isSuccess() || bundlesResult.Value.length === 0) {
//       // Retorna error si no se pueden obtener los bundles o está vacío
//       return Result.fail<UpdateBundleServiceResponseDto>(
//         new Error('No se han encontrado bundles para actualizar.'),
//         404,
//         'No se han encontrado bundles.'
//       );
//     }

//     // Paso 2: Buscar el bundle por ID
//     const bundleToUpdate = bundlesResult.Value.find(bundle => bundle.Id.Value === data.id);

//     if (!bundleToUpdate) {
//       // Retorna error si el bundle con el ID proporcionado no existe
//       return Result.fail<UpdateBundleServiceResponseDto>(
//         new Error('Bundle no encontrado.'),
//         404,
//         'No se ha encontrado el bundle con el ID proporcionado.'
//       );
//     }

//     // Paso 3: Actualizar los atributos del bundle
//     bundleToUpdate.updateDetails(
//       data.name,
//       data.description,
//       data.price,
//       data.currency,
//       data.weight,
//       data.measurement,
//       data.stock,
//       data.caducityDate ? data.caducityDate : null
//     );

//     // Paso 4: Guardar el bundle actualizado en el repositorio
//     const updateResult = await this.bundleRepository.updateBundle(bundleToUpdate);

//     if (!updateResult.isSuccess()) {
//       // Retorna error si no se pudo actualizar el bundle
//       return Result.fail<UpdateBundleServiceResponseDto>(
//         updateResult.Error,
//         updateResult.StatusCode,
//         updateResult.Message
//       );
//     }

//     // Paso 5: Publicar eventos si es necesario
//     this.eventHandler.publish(bundleToUpdate.pullEvents());

//     // Paso 6: Preparar la respuesta
//     const response: UpdateBundleServiceResponseDto = {
//       updatedBundleId: bundleToUpdate.Id.Value,
//       updatedName: bundleToUpdate.name.Value,
//       updatedDescription: bundleToUpdate.description.Value,
//       updatedPrice: bundleToUpdate.price.Price,
//       updatedCurrency: bundleToUpdate.price.Currency,
//       updatedWeight: bundleToUpdate.weight.Weight,
//       updatedMeasurement: bundleToUpdate.weight.Measurement,
//       updatedStock: bundleToUpdate.stock.Value,
//       updatedCaducityDate: bundleToUpdate.caducityDate ? bundleToUpdate.caducityDate.Value : null
//     };

//     return Result.success<UpdateBundleServiceResponseDto>(response, 200);
//   }

//   get name(): string {
//     return this.constructor.name;
//   }
// }
