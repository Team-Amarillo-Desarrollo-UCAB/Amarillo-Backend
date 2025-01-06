import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { UpdateBundleServiceEntryDto } from "../../dto/entry/update-bundle-service-entry.dto";
import { UpdateBundleServiceResponseDto } from "../../dto/response/update-bundle-service-response.dto";
import { BundleName } from "src/bundle/domain/value-objects/bundle-name";
import { BundleDescription } from "src/bundle/domain/value-objects/bundle-description";
import { BundlePrice } from "src/bundle/domain/value-objects/bundle-price";
import { BundleWeight } from "src/bundle/domain/value-objects/bundle-weight";
import { BundleStock } from "src/bundle/domain/value-objects/bundle-stock";
import { BundleCaducityDate } from "src/bundle/domain/value-objects/bundle-caducityDate";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductId } from "src/product/domain/value-objects/product-id";

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

    const bundleR = bundleResult.Value

     if(data.name){
         const verifyName = await this.bundleRepository.findAllBundles(null, null, null, data.name, null, null, null)
         console.log("valor de result - verifyname:",verifyName.Value)
         if(verifyName.Value.length!==0) {
          console.log("ENTRO AL IF")
          return Result.fail(new Error("Ya existe un combo con ese nombre registrado"),409,"Ya existe un combo con ese nombre registrado")
        }
        bundleR.updateName(BundleName.create(data.name))
          
     }

     if(data.description){
      bundleR.updateDescription(BundleDescription.create(data.description))
     }

     let dataPrice = bundleR.price.Price

     if(data.price){
      dataPrice = data.price
     }

     let dataCurrency = bundleR.price.Currency

     if(data.currency){
      dataCurrency=data.currency
     }

     bundleR.updatePrice(BundlePrice.create(dataPrice,dataCurrency))

     let dataWeight = bundleR.weight.Weight

     if(data.weight){
       dataWeight = data.weight
     }

     let dataMeasurement = bundleR.weight.Measurement

     if(data.measurement){
      dataMeasurement = data.measurement
     }

     bundleR.updateWeight(BundleWeight.create(dataWeight,dataMeasurement))

     if(data.stock){
      bundleR.updateStock(BundleStock.create(data.stock))
     }

     if(data.caducityDate){
      bundleR.updateCaducityDate(BundleCaducityDate.create(data.caducityDate))
     }

     if(data.discount){
      //PENDIENTE VALIDAR SI DESCUENTO EXISTE
      bundleR.updateDiscount(DiscountID.create(data.discount))
     }



     if(data.category){

      //PENDIENTE VALIDAR SI CAT EXISTE
 

      let cts = []

      for (const c of data.category){
       cts.push(CategoryID.create(c))
      }
      bundleR.updateCategories(cts)
     }

     if(data.productId){

      //PENDIENTE VALIDAR SI PRODS EXISTE

      let pds = []

      for (const p of data.productId){
       pds.push(ProductId.create(p))
      }
      bundleR.updateProducts(pds)
     }

     if(data.images){

      let ims = []

      for (const i of data.productId){
       ims.push(ProductId.create(i))
      }
      bundleR.updateImages(ims)
     }



    const updateResult = await this.bundleRepository.updateBundle(bundleResult.Value);

    console.log("VALOR DE UPDATE RESULT:",updateResult.Value)

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
