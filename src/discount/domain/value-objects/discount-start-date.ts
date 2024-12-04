import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class DiscountStartDate implements IValueObject<DiscountStartDate> {
  private readonly startDate: Date;

  protected constructor(startDate: Date) {
    this.startDate = startDate;
  }

  // Getter para obtener la fecha encapsulada
  get Value(): Date {
    return this.startDate;
  }

  // Compara dos objetos `DiscountStartDate`
  equals(valueObject: DiscountStartDate): boolean {
    return this.startDate.getTime() === valueObject.startDate.getTime();
  }

  // Crea una nueva instancia desde un objeto `Date`
  static create(startDate: Date): DiscountStartDate {
    return new DiscountStartDate(startDate);
  }
}
