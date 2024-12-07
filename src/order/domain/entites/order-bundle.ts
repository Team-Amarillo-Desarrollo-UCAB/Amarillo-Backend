import { Entity } from "src/common/domain/entity/entity";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { OrderBundleName } from "../value-object/order-bundle/order-bundle-name";
import { OrderBundleCantidad } from "../value-object/order-bundle/order-bundle-cantidad";
import { OrderBundlePrice } from "../value-object/order-bundle/order-bundle-price";

export class OrderBundle extends Entity<BundleID> {

    protected constructor(
        id: BundleID,
        private readonly name: OrderBundleName,
        private readonly cantidad: OrderBundleCantidad,
        private readonly precio: OrderBundlePrice
    ) {
        super(id)
    }

    Name(){
        return this.name
    }

    Cantidad(){
        return this.cantidad
    }

    Moneda(){
        return this.precio.Currency
    }

    Precio(){
        return this.precio
    }

    static create(
        id: BundleID,
        name: OrderBundleName,
        cantidad: OrderBundleCantidad,
        precio: OrderBundlePrice
    ) {
        return new OrderBundle(id,name,cantidad,precio)
    }

}