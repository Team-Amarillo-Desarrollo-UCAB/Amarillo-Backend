import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidDeadlineException } from "../exceptions/invalid-deadline.exception";

export class Deadline implements IValueObject<Deadline> {
  private readonly deadlineDate: Date;

  protected constructor(deadlineDate: Date) {
    // Validación para asegurar que la fecha no sea del pasado
    if (deadlineDate < new Date()) {
      throw new InvalidDeadlineException("La fecha límite no puede ser una fecha pasada.");
    }

    this.deadlineDate = deadlineDate;
  }

  // Getter para obtener la fecha encapsulada
  get Value(): Date {
    return this.deadlineDate;
  }

  // Compara dos objetos `Deadline`
  equals(valueObject: Deadline): boolean {
    return this.deadlineDate.getTime() === valueObject.deadlineDate.getTime();
  }

  // Crea una nueva instancia desde un objeto `Date`
  static create(deadlineDate: Date): Deadline {
    return new Deadline(deadlineDate);
  }
}
