import { IShippingFee } from "src/common/domain/domain-service/shipping-fee-calculate.port";
import { Result } from "src/common/domain/result-handler/Result";
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderShippingFee } from "src/order/domain/value-object/order-shipping-fee";
import { OrderTotal } from "src/order/domain/value-object/order-total";

export class ShippingFeeLocationMock implements IShippingFee {

    async execute(ubicacion: OrderLocationDelivery, total?: OrderTotal): Promise<Result<OrderShippingFee>> {
        return Result.success(OrderShippingFee.create(1), 200)
    }

}