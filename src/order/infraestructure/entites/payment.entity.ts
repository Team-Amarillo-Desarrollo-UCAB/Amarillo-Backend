import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { OrmOrder } from "./order.entity";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { Moneda } from "src/product/domain/enum/Monedas";
import { OrmPaymentMethod } from "src/payment-method/infraestructure/entities/payment-method.entity";

@Entity({ name: "pago" })
export class Payment {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: "numeric" })
    monto: number

    @Column({ type: 'enum', enum: EnumPaymentMethod })
    metodo: EnumPaymentMethod

    @Column({ type: 'enum', enum: Moneda })
    moneda: Moneda

    @Column({ name: 'id_metodo', type: "uuid", unique: false, nullable: true })
    id_metodo: string


    static create(
        id: string,
        monto: number,
        metodo: EnumPaymentMethod,
        moneda: Moneda,
        id_metodo?: string,
    ) {
        const pago = new Payment()
        pago.id = id
        pago.monto = monto
        pago.metodo = metodo
        pago.moneda = moneda
        pago.id_metodo = id_metodo
        return pago
    }

}