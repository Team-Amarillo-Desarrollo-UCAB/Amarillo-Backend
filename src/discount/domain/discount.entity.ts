import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';
import { DiscountID } from './value-objects/discount-id';
import { DiscountName } from './value-objects/discount-name';
import { DiscountDescription } from './value-objects/discount-description';
import { DiscountPercentage } from './value-objects/discount-percentage';
import { DiscountStartDate } from './value-objects/discount-start-date';
import { DiscountCreated } from './events/discount-created-event';
import { Deadline } from './value-objects/discount-deadline';
import { InvalidDiscountException } from './exceptions/invalid-discount.exception';
import { DiscountImage } from './value-objects/discount-image';

export class Discount extends AggregateRoot<DiscountID> {
  private discountName: DiscountName;
  private discountDescription: DiscountDescription;
  private discountPercentage: DiscountPercentage;
  private discountStartDate: DiscountStartDate;
  private deadline: Deadline;
  private image: DiscountImage;

  private constructor(
    id: DiscountID,
    discountName: DiscountName,
    discountDescription: DiscountDescription,
    discountPercentage: DiscountPercentage,
    discountStartDate: DiscountStartDate,
    deadline: Deadline,
    image: DiscountImage
  ) {
    const discountCreated: DiscountCreated = DiscountCreated.create(
      id.Value,
      discountName.Value,
      discountDescription.Value,
      discountPercentage.Value,
      discountStartDate.Value,
      deadline.Value,
      image.Image
    );
    super(id, discountCreated);

    this.discountName = discountName;
    this.discountDescription = discountDescription;
    this.discountPercentage = discountPercentage;
    this.discountStartDate = discountStartDate;
    this.deadline = deadline;
    this.image = image;

    this.ensureValidState();
  }

  // Método estático para crear una nueva instancia de Discount
  public static create(
    id: DiscountID,
    discountName: DiscountName,
    discountDescription: DiscountDescription,
    discountPercentage: DiscountPercentage,
    discountStartDate: DiscountStartDate,
    deadline: Deadline,
    image: DiscountImage
  ): Discount {
    return new Discount(id, discountName, discountDescription, discountPercentage, discountStartDate, deadline, image);
  }

  // Aplicar eventos de dominio
  protected applyEvent(event: DomainEvent): void {
    if (event.eventName === 'DiscountCreated') {
      const discountCreated: DiscountCreated = event as DiscountCreated;
      this.discountName = DiscountName.create(discountCreated.name);
      this.discountDescription = DiscountDescription.create(discountCreated.description);
      this.discountPercentage = DiscountPercentage.create(discountCreated.percentage);
      this.discountStartDate = DiscountStartDate.create(discountCreated.startDate);
      this.deadline = Deadline.create(discountCreated.deadline);
      this.image = DiscountImage.create(discountCreated.image);
    }
  }

  // Validación del estado interno de la entidad
  protected ensureValidState(): void {
    if (!this.discountName || !this.discountDescription || !this.discountPercentage || !this.discountStartDate || !this.deadline) {
      throw new InvalidDiscountException('Todos los atributos del descuento deben estar definidos.');
    }
  }

  // Getters
  get ID(): DiscountID {
    return this.Id;
  }

  get Name(): DiscountName {
    return this.discountName;
  }

  get Description(): DiscountDescription {
    return this.discountDescription;
  }

  get Percentage(): DiscountPercentage {
    return this.discountPercentage;
  }

  get StartDate(): DiscountStartDate {
    return this.discountStartDate;
  }

  get Deadline(): Deadline {
    return this.deadline;
  }

  get Image(): DiscountImage {
    return this.image;
  }
}
