import { IValueObject } from "src/common/domain/value-object/value-object.interface";
export class CuponCreationDate implements IValueObject<CuponCreationDate>{

    private readonly creation_date: Date

    protected constructor(creation_date: Date){

        this.creation_date = creation_date

    }

    CreationDate(){
        return this.creation_date
    }

    equals(valueObject: CuponCreationDate): boolean {
        return this.creation_date === valueObject.CreationDate()
    }

    static create(creation_date: Date){
        return new CuponCreationDate(creation_date)
    }
}