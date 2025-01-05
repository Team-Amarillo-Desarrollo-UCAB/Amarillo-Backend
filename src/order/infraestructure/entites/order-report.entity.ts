import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OrmOrder } from "./order.entity";

@Entity({ name: "reporte" })
export class OrmReport {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: "varchar", nullable: true })
    texto: string

    static create(
        id: string,
        texto: string
    ): OrmReport {
        const reporte = new OrmReport()
        reporte.id = id
        reporte.texto = texto
        return reporte
    }

}