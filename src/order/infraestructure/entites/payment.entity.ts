import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { OrmOrder } from "./order.entity";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { Moneda } from "src/product/domain/enum/Monedas";

@Entity({ name: "pago" })
export class Payment {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: "numeric" })
    monto: number

    @Column({ type: 'enum', enum: EnumPaymentMethod })
    metodo: EnumPaymentMethod

    @Column({type: 'enum', enum: Moneda})
    moneda: Moneda

    @OneToOne(() => OrmOrder,{ lazy: true })
    @JoinColumn({name: 'ordenId'})
    orden: OrmOrder

    static create(
        id: string,
        monto: number,
        metodo: EnumPaymentMethod,
        moneda: Moneda,
    ) {
        const pago = new Payment()
        pago.id = id
        pago.monto = monto
        pago.metodo = metodo
        pago.moneda = moneda
        return pago
    }

}