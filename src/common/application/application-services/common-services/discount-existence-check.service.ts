import { Result } from "src/common/domain/result-handler/Result";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";

export class DiscountExistenceService{
    constructor(private readonly discountRepository: IDiscountRepository){
        this.discountRepository=discountRepository;
    }

    async discountExistenceCheck(idDiscount:string):Promise<Result<DiscountID>>{
        let discount:DiscountID=null
        //for (const c of categoriesID){
            const disID = DiscountID.create(idDiscount)
            const discountResult = await this.discountRepository.findDiscountById(disID.Value)

            if(!discountResult.isSuccess()){
                return Result.fail(new Error('ERROR: El descuento no existe en la BD'),404,'Descuento no existe en BD')
            }else{
                discount=disID
                
            }

        //}
        return Result.success(discount,200) 
    }
}