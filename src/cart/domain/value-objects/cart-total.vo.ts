import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class CartTotal implements IValueObject<CartTotal> {
  private readonly total: number;

  private constructor(total: number) {
    this.total = total;
  }

  public static create(total: number): CartTotal {
    if (total < 0) throw new Error('El total no puede ser negativo.');
    return new CartTotal(total);
  }

  public equals(valueObject: CartTotal): boolean {
    return this.total === valueObject.total;
  }

  getTotal(): number {
    return this.total;
  }
}
