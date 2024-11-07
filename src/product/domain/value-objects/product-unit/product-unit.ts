import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { UnidadMedida } from "../../enum/UnidadMedida";
import { ProductCantidadMedida } from "./product-cantidad-medida";

export class ProductUnit implements IValueObject<ProductUnit>{
    private readonly unit: UnidadMedida;
    private readonly cantidad_medida: ProductCantidadMedida

    protected constructor(
        unit: UnidadMedida,
        cantidad_medida: ProductCantidadMedida
    ){
        
        this.unit = unit
        this.cantidad_medida = cantidad_medida

    }

    get Unit(): string{
        return this.unit
    }

    get Cantidad_medida(): number{
        return this.cantidad_medida.Cantidad_medida
    }
    
    equals(valueObject: ProductUnit): boolean {
        return (this.unit === valueObject.Unit) && (this.cantidad_medida === valueObject.cantidad_medida)
    }

    static create(unit: UnidadMedida, cantidad_medida: ProductCantidadMedida): ProductUnit{
        return new ProductUnit(unit,cantidad_medida)
    }
}