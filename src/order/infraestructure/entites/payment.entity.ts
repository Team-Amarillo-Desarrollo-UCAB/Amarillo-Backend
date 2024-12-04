import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { OrmOrder } from "./order.entity";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";

@Entity({ name: "pago" })
export class Payment {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: "numeric" })
    monto: number

    @Column({ type: 'enum', enum: EnumPaymentMethod })
    metodo: EnumPaymentMethod

    @OneToOne(() => OrmOrder,{ lazy: true, eager: false })
    @JoinColumn()
    orden: OrmOrder

    static create(
        id: string,
        monto: number,
        metodo: EnumPaymentMethod,
        orden: OrmOrder
    ) {
        const pago = new Payment()
        pago.id = id
        pago.monto = monto
        pago.metodo = metodo
        pago.orden = orden
        return pago
    }

}