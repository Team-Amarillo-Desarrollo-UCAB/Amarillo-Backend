import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Detalle_Orden } from "./detalle_orden.entity";
import { Estado_Orden } from "./Estado-orden/estado_orden.entity";
import { Payment } from "./payment.entity";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

@Entity({ name: "Orden" })
export class OrmOrder {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: "numeric" })
    monto_total: number

    @Column({ name: 'id_user', type: "uuid", unique: false, nullable: true })
    id_user: string

    @OneToMany(() => Detalle_Orden, (detalle) => detalle.orden, { eager: true })
    detalles: Detalle_Orden[];

    @OneToMany(() => Estado_Orden, (estado_orden) => estado_orden.orden, { eager: true })
    estados: Estado_Orden[];

    @OneToOne(() => Payment, { eager: true })
    @JoinColumn({ name: 'pagoId' })
    pago: Payment

    static create(
        id: string,
        fecha_creacion: Date,
        //fecha_entrega: Date,
        monto_total: number,
        detalles?: Detalle_Orden[],
        estados?: Estado_Orden[],
        pago?: Payment
    ): OrmOrder {
        const orden = new OrmOrder()
        orden.id = id
        orden.fecha_creacion = fecha_creacion
        //orden.fecha_entrega = fecha_entrega
        orden.monto_total = monto_total
        orden.detalles = detalles
        orden.estados = estados
        orden.pago = pago
        return orden
    }

    static createWithUser(
        id: string,
        fecha_creacion: Date,
        //fecha_entrega: Date,
        monto_total: number,
        id_user: string,
        detalles?: Detalle_Orden[],
        estados?: Estado_Orden[],
        pago?: Payment
    ): OrmOrder {
        const orden = new OrmOrder()
        orden.id = id
        orden.fecha_creacion = fecha_creacion
        //orden.fecha_entrega = fecha_entrega
        orden.monto_total = monto_total
        orden.id_user = id_user
        orden.detalles = detalles
        orden.estados = estados
        orden.pago = pago
        return orden
    }
}