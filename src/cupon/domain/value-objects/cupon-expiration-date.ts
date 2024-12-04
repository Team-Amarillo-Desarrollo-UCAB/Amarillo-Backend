import { IValueObject } from "src/common/domain/value-object/value-object.interface";
export class CuponExpirationDate implements IValueObject<CuponExpirationDate>{
    
    protected constructor(
        private readonly expiration_date: Date
    ){

        const today = new Date()

        if(
            expiration_date.getDay === today.getDay &&
            expiration_date.getMonth === today.getMonth &&
            expiration_date.getFullYear === today.getFullYear
        )
            throw new Error("La fecha de expiracion del cupon no puede ser la fecha actual")

    }

    ExpirationDate(){
        return this.expiration_date
    }

    equals(valueObject: CuponExpirationDate): boolean {
        throw new Error('Method not implemented.');
    }

    static create(expiration_date: Date){
        return new CuponExpirationDate(expiration_date)
    }

}