import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Discount } from 'src/discount/domain/discount.entity';
import { DiscountID } from 'src/discount/domain/value-objects/discount-id';
import { DiscountName } from 'src/discount/domain/value-objects/discount-name';
import { DiscountDescription } from 'src/discount/domain/value-objects/discount-description';
import { DiscountPercentage } from 'src/discount/domain/value-objects/discount-percentage';
import { DiscountStartDate } from 'src/discount/domain/value-objects/discount-start-date';
import { Deadline } from 'src/discount/domain/value-objects/discount-deadline';
import { OrmDiscount } from '../entities/orm-discount.entity';

export class OrmDiscountMapper implements IMapper<Discount, OrmDiscount> {
  

  async fromDomainToPersistence(domain: Discount): Promise<OrmDiscount> {
    const ormDiscount = OrmDiscount.create(
      domain.Id.Value,                     
      domain.Name.Value,                   
      domain.Description.Value,            
      domain.Percentage.Value,             
      domain.StartDate.Value,             
      domain.Deadline.Value                
    );
    
    return ormDiscount;
  }

 
  async fromPersistenceToDomain(persistence: OrmDiscount): Promise<Discount> {
    const discount = Discount.create(
      DiscountID.create(persistence.id),                 
      DiscountName.create(persistence.name),             
      DiscountDescription.create(persistence.description), 
      DiscountPercentage.create(persistence.percentage), 
      DiscountStartDate.create(persistence.startDate),   
      Deadline.create(persistence.deadline)             
    );
    
    return discount;
  }
}
