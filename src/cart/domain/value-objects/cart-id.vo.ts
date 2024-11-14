import { IValueObject } from 'src/common/domain/value-object/value-object.interface';
import { v4 as uuidv4 } from 'uuid';

export class CartID implements IValueObject<CartID> {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): CartID {
    return new CartID(id ?? uuidv4());
  }

  public equals(valueObject: CartID): boolean {
    return this.id === valueObject.id;
  }
  
  getId(): string {
    return this.id;
  }
}
