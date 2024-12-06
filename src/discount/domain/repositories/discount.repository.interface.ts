import { Result } from 'src/common/domain/result-handler/Result';
import { Discount } from '../discount.entity';

// Puerto del repositorio de descuentos
export interface IDiscountRepository {

    addDiscount(discount: Discount): Promise<Result<Discount>>;
    findAllDiscounts(page: number, limit: number):Promise<Result<Discount[]>>
    findDiscountById(id: string): Promise<Result<Discount>>;
}
