import { IValueObject } from 'src/common/domain/value-object/value-object.interface';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';//lo que vi del curso de FH, creo que se pudiera manejar con expresiones regulares
import { InvalidBundleIdException } from '../exceptions/invalid-bundle-id.exception';

export class BundleID implements IValueObject<BundleID> {
    private readonly id: string;

    private constructor(id: string) {
        if (!uuidValidate(id)) {
            //excepcion de dominio pertinente
            throw new InvalidBundleIdException("El ID del combo debe ser un UUID válido")
        }
        this.id = id;
    }

    public static create(id?: string): BundleID {
        return new BundleID(id ? id : uuidv4());
    }

    public equals(other: BundleID): boolean {
        return this.id === other.id;
    }

    get Value(){ return this.id }
}
