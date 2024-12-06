import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'discount' }) // Nombre de la tabla en la base de datos
export class OrmDiscount {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar')
  description: string;

  @Column('float')
  percentage: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column('varchar', { nullable: true })
  image: string

  static create(
    id: string,
    name: string,
    description: string,
    percentage: number,
    startDate: Date,
    deadline: Date,
    image?: string
  ): OrmDiscount {
    const discount = new OrmDiscount();
    discount.id = id;
    discount.name = name;
    discount.description = description;
    discount.percentage = percentage;
    discount.startDate = startDate;
    discount.deadline = deadline;
    discount.image = image;
    return discount;
  }
}
