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
    async findDiscountById(id: string): Promise<Result<Discount>> {
        const discount = this.discounts.find(
            (discount) => discount.Id.Value === id,
          );
          if (discount === undefined) {
            return Result.fail<Discount>(
              new Error(`Discount with id ${id} not found`),
              404,
              `Discount with id ${id} not found`,
            );
          }
          return Result.success<Discount>(discount, 200);
          
    }
    updateDiscount(discount: Discount): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }
    deleteDiscount(id: string): Promise<Result<Discount>> {
        throw new Error("Method not implemented.");
    }


}