import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { UpdateBundleServiceEntryDto } from "../../dto/entry/update-bundle-service-entry.dto";
import { UpdateBundleServiceResponseDto } from "../../dto/response/update-bundle-service-response.dto";

export class UpdateBundleApplicationService 
  implements IApplicationService<UpdateBundleServiceEntryDto, UpdateBundleServiceResponseDto> {
  
  private readonly bundleRepository: IBundleRepository;
  private readonly eventHandler: IEventHandler;

  constructor(
    bundleRepository: IBundleRepository,
    eventHandler: IEventHandler
  ) {
    this.bundleRepository = bundleRepository;
    this.eventHandler = eventHandler;
  }

  async execute(data: UpdateBundleServiceEntryDto): Promise<Result<UpdateBundleServiceResponseDto>> {//page, perpage, null, data.name, null, null, null
    const page = 1;
    const perpage = 10;

    const bundleResult = await this.bundleRepository.findBundleById(data.id);

    if (!bundleResult.isSuccess()) {
      return Result.fail<UpdateBundleServiceResponseDto>(
        new Error('Bundle a actualizar no existente'),
        404,
        'Bundle a actualizar no existente.'
      );
    }

    console.log("HERMANO DATA.NAME ES:",data.name)

     if(data.name){
         const verifyName = await this.bundleRepository.findAllBundles(null, null, null, data.name, null, null, null)
         console.log("valor de result - verifyname:",verifyName.Value)
         if(verifyName.Value.length!==0) {
          console.log("ENTRO AL IF")
          return Result.fail(new Error("Ya existe un combo con ese nombre registrado"),409,"Ya existe un combo con ese nombre registrado")
         }
          
     }

    const updateResult = await this.bundleRepository.updateBundle(bundleResult.Value);

    if (!updateResult.isSuccess()) {
      return Result.fail<UpdateBundleServiceResponseDto>(
        new Error("Bundle no modificado"),updateResult.StatusCode,'Bundle no modificado');
    }


    const response: UpdateBundleServiceResponseDto = {
        id: data.id

    };

    return Result.success<UpdateBundleServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}
