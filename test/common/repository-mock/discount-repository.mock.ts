import { Result } from "src/common/domain/result-handler/Result";
import { Discount } from "src/discount/domain/discount.entity";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";


export class DiscountMockRepository implements IDiscountRepository{

    private readonly discounts: Discount[]=[]
    addDiscount(discount: Discount): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }

    async createDiscount(discount: Discount): Promise<void> {
        this.discounts.push(discount);
    }
    findAllDiscounts(page: number, perpage: number): Promise<Result<Discount[]>> {
        throw new Error("Method not implemented.");
    }
    findDiscountById(id: string): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }
    updateDiscount(discount: Discount): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }
    deleteDiscount(id: string): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }


}