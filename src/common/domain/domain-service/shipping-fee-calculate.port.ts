import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { Result } from "../result-handler/Result";
import { OrderShippingFee } from "src/order/domain/value-object/order-shipping-fee";
import { OrderTotal } from "src/order/domain/value-object/order-total";

export interface IShippingFee {
    execute(ubicacion: OrderLocationDelivery, total?: OrderTotal): Promise<Result<OrderShippingFee>>
}