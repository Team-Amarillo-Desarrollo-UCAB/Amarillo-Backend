import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidProductWeightException } from "../domain-exception/invalid-product-weight.exception";


export class ProductWeight implements IValueObject<ProductWeight> {
    private weight: number;


    protected constructor(weight: number) {
        if (weight <= 0) {
            throw new InvalidProductWeightException("El peso debe ser mayor a 0");
        }


        this.weight = weight;
    }



    get Weight(): number{
        return this.weight
    }

    

    equals(valueObject: ProductWeight): boolean {
        return this.weight === valueObject.weight 
        ;
    }

    static create(weight: number): ProductWeight {
        return new ProductWeight(weight);
    }
}