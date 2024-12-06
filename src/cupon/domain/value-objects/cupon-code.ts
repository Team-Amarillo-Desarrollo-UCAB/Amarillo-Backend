import { IValueObject } from "src/common/domain/value-object/value-object.interface";
export class CuponCode implements IValueObject<CuponCode>{
    // TODO: Implementar invariantes del codigo
    protected constructor(
        private readonly code: string
    ){

    }

    Code(){
        return this.code
    }

    equals(valueObject: CuponCode): boolean {
        return this.code === valueObject.Code()
    }

    static create(code: string){
        return new CuponCode(code)
    }

}