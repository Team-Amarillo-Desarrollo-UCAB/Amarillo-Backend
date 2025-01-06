import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Detalle_Orden } from "./detalle_orden.entity";
import { Estado_Orden } from "./Estado-orden/estado_orden.entity";
import { Payment } from "./payment.entity";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmReport } from "./order-report.entity";

@Entity({ name: "Orden" })
export class OrmOrder {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: 'timestamp', nullable: true })
    fecha_entrega: Date;

    @Column({ type: "numeric" })
    monto_total: number

    @Column({ type: "numeric", nullable: true })
    longitud: number

    @Column({ type: "numeric", nullable: true })
    latitud: number

    @Column({ type: "varchar", nullable: true })
    ubicacion: string

    @Column({ type: "numeric", nullable: true })
    subTotal: number

    @Column({ type: "numeric", nullable: true })
    descuento: number

    @Column({ type: "numeric", nullable: true })
    shipping_fee: number

    @Column({ type: "varchar", nullable: true })
    instruccion: string

    @Column({ name: 'id_user', type: "uuid", unique: false, nullable: true })
    id_user: string

    @OneToMany(() => Detalle_Orden, (detalle) => detalle.orden, { eager: true })
    detalles: Detalle_Orden[];

    @OneToMany(() => Estado_Orden, (estado_orden) => estado_orden.orden, { eager: true })
    estados: Estado_Orden[];

    @Column({ name: 'id_reporte', type: "uuid", unique: false, nullable: true })
    id_reporte: string

    @OneToOne(() => OrmReport, { cascade: true })
    @JoinColumn({ name: 'id_reporte' })
    reporte: OrmReport

    @OneToOne(() => Payment, { cascade: true })
    @JoinColumn({ name: 'pagoId' })
    pago: Payment

    static create(
        id: string,
        fecha_creacion: Date,
        fecha_entrega: Date,
        monto_total: number,
        longitud: number,
        latitud: number,
        ubicacion: string,
        subTotal: number,
        descuento: number,
        shipping_fee: number,
        instruccion?: string,
        detalles?: Detalle_Orden[],
        estados?: Estado_Orden[],
        pago?: Payment,
        reporte?: OrmReport
    ): OrmOrder {
        const orden = new OrmOrder()
        orden.id = id
        orden.fecha_creacion = fecha_creacion
        orden.fecha_entrega = fecha_entrega
        orden.longitud = longitud
        orden.latitud = latitud
        orden.ubicacion = ubicacion
        orden.descuento = descuento
        orden.monto_total = monto_total
        orden.subTotal = subTotal
        orden.shipping_fee = shipping_fee
        orden.detalles = detalles
        orden.estados = estados
        orden.pago = pago
        orden.reporte = reporte
        return orden
    }

    static createWithUser(
        id: string,
        fecha_creacion: Date,
        fecha_entrega: Date,
        longitud: number,
        latitud: number,
        ubicacion: string,
        monto_total: number,
        subTotal: number,
        descuento: number,
        shipping_fee: number,
        id_user: string,
        instruccion?: string,
        detalles?: Detalle_Orden[],
        estados?: Estado_Orden[],
        pago?: Payment,
        id_reporte?: string
    ): OrmOrder {
        const orden = new OrmOrder()
        orden.id = id
        orden.fecha_creacion = fecha_creacion
        orden.fecha_entrega = fecha_entrega
        orden.longitud = longitud
        orden.latitud = latitud
        orden.ubicacion = ubicacion
        orden.monto_total = monto_total
        orden.subTotal = subTotal
        orden.descuento = descuento
        orden.shipping_fee = shipping_fee
        orden.id_user = id_user
        orden.instruccion = instruccion
        orden.detalles = detalles
        orden.estados = estados
        orden.pago = pago
        orden.id_reporte = id_reporte
        return orden
    }
}