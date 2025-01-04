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
import { DiscountDeadlineModified } from './events/discount-deadline-modified.event';
import { DiscountDescriptionModified } from './events/discount-description-modified.event';
import { DiscountImageModified } from './events/discount-image-modified.event';
import { DiscountNameModified } from './events/discount-name-modified.event';
import { DiscountPercentageModified } from './events/discount-percentage-modified.event';
import { DiscountStartDateModified } from './events/discount-startDate-modified.event';

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
  switch (event.eventName) {
    case 'DiscountCreated':
      const discountCreated: DiscountCreated = event as DiscountCreated;
      this.discountName = DiscountName.create(discountCreated.name);
      this.discountDescription = DiscountDescription.create(discountCreated.description);
      this.discountPercentage = DiscountPercentage.create(discountCreated.percentage);
      this.discountStartDate = DiscountStartDate.create(discountCreated.startDate);
      this.deadline = Deadline.create(discountCreated.deadline);
      this.image = DiscountImage.create(discountCreated.image);
      break;

    case 'DiscountNameModified':
      const nameModified: DiscountNameModified = event as DiscountNameModified;
      this.discountName = DiscountName.create(nameModified.name);
      break;

    case 'DiscountDescriptionModified':
      const descriptionModified: DiscountDescriptionModified = event as DiscountDescriptionModified;
      this.discountDescription = DiscountDescription.create(descriptionModified.description);
      break;

    case 'DiscountPercentageModified':
      const percentageModified: DiscountPercentageModified = event as DiscountPercentageModified;
      this.discountPercentage = DiscountPercentage.create(percentageModified.percentage);
      break;

    case 'DiscountStartDateModified':
      const startDateModified: DiscountStartDateModified = event as DiscountStartDateModified;
      this.discountStartDate = DiscountStartDate.create(startDateModified.date);
      break;

    case 'DiscountDeadlineModified':
      const deadlineModified: DiscountDeadlineModified = event as DiscountDeadlineModified;
      this.deadline = Deadline.create(deadlineModified.date);
      break;

    case 'DiscountImageModified':
      const imageModified: DiscountImageModified = event as DiscountImageModified;
      this.image = DiscountImage.create(imageModified.image);
      break;

    default:
      throw new Error(`Evento de dominio no manejado: ${event.eventName}`);
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

  // Métodos para actualizar atributos específicos mediante eventos de dominio
public updateName(name: DiscountName): void {
  this.onEvent(DiscountNameModified.create(this.Id.Value, name.Value));
}

public updateDescription(description: DiscountDescription): void {
  this.onEvent(DiscountDescriptionModified.create(this.Id.Value, description.Value));
}

public updatePercentage(percentage: DiscountPercentage): void {
  this.onEvent(DiscountPercentageModified.create(this.Id.Value, percentage.Value));
}

public updateStartDate(startDate: DiscountStartDate): void {
  this.onEvent(DiscountStartDateModified.create(this.Id.Value, startDate.Value));
}

public updateDeadline(deadline: Deadline): void {
  this.onEvent(DiscountDeadlineModified.create(this.Id.Value, deadline.Value));
}

public updateImage(image: DiscountImage): void {
  this.onEvent(DiscountImageModified.create(this.Id.Value, image.Image));
}

}
