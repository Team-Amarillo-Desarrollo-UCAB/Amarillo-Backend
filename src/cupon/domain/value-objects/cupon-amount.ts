import { IValueObject } from "src/common/domain/value-object/value-object.interface";
export class CuponAmount implements IValueObject<CuponAmount>{

    protected constructor(
        private readonly ammount: number
    ){

        if(ammount <= 0)
            throw new Error('El monto del cupon no puede ser menor o igual a 0');

    }

    Amount(){
        return this.ammount
    }

    equals(valueObject: CuponAmount): boolean {
        return this.ammount === valueObject.Amount()
    }

    static create(ammount: number){
        return new CuponAmount(ammount)
    }

}