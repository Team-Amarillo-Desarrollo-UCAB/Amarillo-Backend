import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class DetailCantidad implements IValueObject<DetailCantidad> {
  private readonly cantidad: number;

  private constructor(cantidad: number) {
    this.cantidad = cantidad;
  }

  public static create(cantidad: number): DetailCantidad {
    if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero.');
    return new DetailCantidad(cantidad);
  }

  public equals(valueObject: DetailCantidad): boolean {
    return this.cantidad === valueObject.cantidad;
  }

  getCantidad(): number {
    return this.cantidad;
  }
}
