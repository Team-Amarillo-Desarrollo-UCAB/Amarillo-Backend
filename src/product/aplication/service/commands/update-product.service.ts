import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { UpdateProductServiceResponseDTO } from "../../DTO/response/update-product-service-response.dto";
import { UpdateProductServiceEntryDTO } from '../../DTO/entry/update-product-service-entry.dto';
import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { ProductDescription } from "src/product/domain/value-objects/product-description";
import { ProductName } from "src/product/domain/value-objects/product-name";
import { ProductPrice } from "src/product/domain/value-objects/product-precio/product-price";
import { ProductAmount } from "src/product/domain/value-objects/product-precio/product-amount";
import { ProductCurrency } from "src/product/domain/value-objects/product-precio/product-currency";
import { ProductUnit } from "src/product/domain/value-objects/product-unit/product-unit";
import { ProductCantidadMedida } from "src/product/domain/value-objects/product-unit/product-cantidad-medida";
import { ProductImage } from "src/product/domain/value-objects/product-image";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductCaducityDate } from "src/product/domain/value-objects/productCaducityDate";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";

export class UpdateProductService implements IApplicationService
    <UpdateProductServiceEntryDTO, UpdateProductServiceResponseDTO> {

    constructor(
        private readonly productRepository: IProductRepository
    ) { }

    async execute(data: UpdateProductServiceEntryDTO): Promise<Result<UpdateProductServiceResponseDTO>> {

        data.name
            ? this.productRepository.verifyNameProduct(data.name)
            : null

        const product = await this.productRepository.findProductById(data.id)
        if (!product.isSuccess()) return Result.fail<UpdateProductServiceResponseDTO>(product.Error, product.StatusCode, product.Message)
        const productResult = product.Value
        productResult.pullEvents()

        if(data.name){
            const verify = await this.productRepository.verifyNameProduct(data.name)
            if(!verify.isSuccess())
                return Result.fail(new Error('Nombre del producto ya registrado'),404,'Nombre del producto ya registrado')
            productResult.updateName(ProductName.create(data.name))
        }

        if(data.description)
            productResult.updateDescription(ProductDescription.create(data.description))

        if (data.stock)
            productResult.updateStock(ProductStock.create(data.stock))

        let dataPrice = productResult.Price

        if(data.price){
            dataPrice = data.price
        }

        let dataCurrency = productResult.Moneda
        
        if(data.currency){
            dataCurrency=data.currency
        }

        productResult.updatePrice(ProductPrice.create(ProductAmount.create(dataPrice),ProductCurrency.create(dataCurrency)))

        let dataUnit = productResult.Unit

        if(data.measurement){
            dataUnit = data.measurement
        }

        let dataMedida = productResult.CantidadMedida

        if(data.weight){
            dataMedida = data.weight
        }

        productResult.updateUnit(ProductUnit.create(dataUnit,ProductCantidadMedida.create(dataMedida)))

        //productResult.updatePrice(ProductPrice.create(ProductAmount.create(dataPrice),ProductCurrency.create(dataCurrency)))

        if(data.images){

        let ims = []

        for (const i of data.images){
        ims.push(ProductImage.create(i))
        }
        productResult.updateImages(ims)
        }

        if(data.category){

            //PENDIENTE VALIDAR SI CAT EXISTE
       
      
            let cts = []
      
            for (const c of data.category){
             cts.push(CategoryID.create(c))
            }
            productResult.updateCategories(cts)
        }

        if(data.caducityDate){
            productResult.updateCaducityDate(ProductCaducityDate.create(data.caducityDate))
        }

        if(data.discount){
            productResult.updateDiscount(DiscountID.create(data.discount))
        }

        const result = await this.productRepository.updateProductAggregate(productResult)

        if(!result.isSuccess())
            return Result.fail<UpdateProductServiceResponseDTO>(new Error("Producto no modificado"),result.StatusCode,'Producto no modificado')

        const response: UpdateProductServiceResponseDTO = {
            id_producto: result.Value.Id.Id
        }

        return Result.success<UpdateProductServiceResponseDTO>(response,200)
    }

    get name(): string {
        return this.constructor.name
    }

}