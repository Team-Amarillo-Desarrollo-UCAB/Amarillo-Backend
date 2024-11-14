import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductCantidadMedida implements IValueObject<ProductCantidadMedida>{
    private readonly cantidad_medida: number

    protected constructor(cantidad: number){

        if(cantidad <= 0)
            throw new Error("La cantidad de la unidad del producto no es valida")

        this.cantidad_medida = cantidad

    }

    get Cantidad_medida(): number{
        return this.cantidad_medida
    }
    
    equals(valueObject: ProductCantidadMedida): boolean {
        return this.cantidad_medida === valueObject.Cantidad_medida
    }

    static create(cantidad: number): ProductCantidadMedida{
        return new ProductCantidadMedida(cantidad)
    }
}