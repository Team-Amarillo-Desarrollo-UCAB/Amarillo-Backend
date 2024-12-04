import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Cupon } from "src/cupon/domain/cupon";
import { OrmCupon } from "../entites/cupon.entity";
import { CuponId } from "src/cupon/domain/value-objects/cupon-id";
import { CuponCode } from "src/cupon/domain/value-objects/cupon-code";
import { CuponExpirationDate } from "src/cupon/domain/value-objects/cupon-expiration-date";
import { CuponAmount } from "src/cupon/domain/value-objects/cupon-amount";
import { CuponCreationDate } from "src/cupon/domain/value-objects/cupon-creation-date";

export class CuponMapper implements IMapper<Cupon, OrmCupon>{

    async fromDomainToPersistence(domain: Cupon): Promise<OrmCupon> {
        const ormCupon = OrmCupon.create(
            domain.Id.Id(),
            domain.Code(),
            domain.CreationDate(),
            domain.ExpirationDate(),
            domain.Amount()
        )
        return ormCupon
    }

    async fromPersistenceToDomain(persistence: OrmCupon): Promise<Cupon> {
        const cupon = Cupon.create(
            CuponId.create(persistence.id),
            CuponCode.create(persistence.code),
            CuponExpirationDate.create(persistence.fecha_expiracion),
            CuponAmount.create(persistence.amount),
            CuponCreationDate.create(persistence.fecha_creacion)
        )
        return cupon
    }

}