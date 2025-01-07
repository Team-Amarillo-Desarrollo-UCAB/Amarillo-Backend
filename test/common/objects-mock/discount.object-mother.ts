import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { Discount } from "src/discount/domain/discount.entity";
import { Deadline } from "src/discount/domain/value-objects/discount-deadline";
import { DiscountDescription } from "src/discount/domain/value-objects/discount-description";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { DiscountImage } from "src/discount/domain/value-objects/discount-image";
import { DiscountName } from "src/discount/domain/value-objects/discount-name";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date";
import { OrmDiscount } from "src/discount/infraestructure/entities/orm-discount.entity";

export class DiscountObjectMother{



    static async createNormalDiscount(name:string){
        const idGenerator = new UuidGenerator();


        const normalDiscount = Discount.create(
            DiscountID.create(await idGenerator.generateId()),
            DiscountName.create(name),
            DiscountDescription.create('descripcion del descuento'),
            DiscountPercentage.create(5),
            DiscountStartDate.create(new Date(2025, 0, 1)),
            Deadline.create(new Date(2026, 0, 1)),
            DiscountImage.create('www.examplediscount.com')
        )

        return normalDiscount
    }

    async createOrmDiscount(){


        return OrmDiscount.create(
            'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7',
            'randon discount name ORM',
            'descripcion del descuento',
            5,
            new Date(2025, 0, 1),
            new Date(2026, 0, 1),
            'www.examplediscount.com'

        )

    }

}