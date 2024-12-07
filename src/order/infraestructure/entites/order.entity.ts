import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Detalle_Orden } from "./detalle_orden.entity";
import { Estado_Orden } from "./Estado-orden/estado_orden.entity";
import { Payment } from "./payment.entity";

@Entity({ name: "Orden" })
export class OrmOrder {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: "numeric" })
    monto_total: number

    @OneToMany(() => Detalle_Orden, (detalle) => detalle.orden, {eager: true})
    detalles: Detalle_Orden[];

    @OneToMany(() => Estado_Orden, (estado_orden) => estado_orden.orden, {eager: true})
    estados: Estado_Orden[];

    @OneToOne(() => Payment,{ eager: true })
    @JoinColumn({name: 'pagoId'})
    pago: Payment


    static create(
        id: string,
        fecha_creacion: Date,
        monto_total: number,
        detalles?: Detalle_Orden[],
        estados?: Estado_Orden[],
        pago?: Payment
    ): OrmOrder {
        const orden = new OrmOrder()
        orden.id = id
        orden.fecha_creacion = fecha_creacion
        orden.monto_total = monto_total
        orden.detalles = detalles
        orden.estados = estados
        orden.pago = pago
        return orden
    }
}