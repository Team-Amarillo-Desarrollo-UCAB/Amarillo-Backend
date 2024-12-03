import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity({name: "cupon"})
export class OrmCupon{

    @PrimaryColumn({ type: "uuid", name: "id_cupon"})
    id: string

    @Column({type: "varchar",unique: true, name: "codigo"})
    code: string

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: 'timestamp' })
    fecha_expiracion: Date;

    @Column({type: "numeric"})
    amount: number

    // TODO: Relacion con el usuario

    static create(
        id: string,
        code: string,
        fecha_creacion: Date,
        fecha_expiracion: Date,
        amount: number
    ){
        const cupon = new OrmCupon()
        cupon.id = id
        cupon.code = code
        cupon.fecha_creacion = fecha_creacion
        cupon.fecha_expiracion = fecha_expiracion
        cupon.amount = amount
        return cupon
    }

}