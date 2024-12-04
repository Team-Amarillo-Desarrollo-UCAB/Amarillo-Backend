import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountCreated extends DomainEvent {
  protected constructor(
    public id: string,
    public name: string,
    public description: string,
    public percentage: number,
    public startDate: Date,
    public deadline: Date
  ) {
    super();
  }

  static create(
    id: string,
    name: string,
    description: string,
    percentage: number,
    startDate: Date,
    deadline: Date
  ): DiscountCreated {
    return new DiscountCreated(id, name, description, percentage, startDate, deadline);
  }
}
