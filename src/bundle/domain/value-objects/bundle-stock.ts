import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidBundleStockException } from "../exceptions/invalid-bundle-stock.exception";

export class BundleStock implements IValueObject<BundleStock> {
    private stock: number;

    protected constructor(stock: number) {
        if (stock < 0) {
            throw new InvalidBundleStockException("El stock no puede ser menor a 0");
        }else if(!stock){
            throw new InvalidBundleStockException("La propiedad stock no puede estar vacía");
        }
        this.stock = stock;
    }

    get Value(): number {
        return this.stock;
    }

    disminuir(stock: number){
        return new BundleStock(this.stock -= stock)
    }

    equals(valueObject: BundleStock): boolean {
        return this.stock === valueObject.stock;
    }

    static create(stock: number): BundleStock {
        return new BundleStock(stock);
    }
}
