import { IValueObject } from 'src/common/domain/value-object/value-object.interface';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'; // lo que vi del curso de FH, creo que se pudiera manejar con expresiones regulares
import { InvalidDiscountIdException } from '../exceptions/invalid-discount-id.exception';

export class DiscountID implements IValueObject<DiscountID> {
    private readonly id: string;

    private constructor(id: string) {
        if (!uuidValidate(id)) {
            // Excepción de dominio pertinente
            throw new InvalidDiscountIdException("El ID del descuento debe ser un UUID válido");
        }
        this.id = id;
    }

    public static create(id?: string): DiscountID {
        return new DiscountID(id ? id : uuidv4());
    }

    public equals(other: DiscountID): boolean {
        return this.id === other.id;
    }

    get Value() {
        return this.id;
    }
}
