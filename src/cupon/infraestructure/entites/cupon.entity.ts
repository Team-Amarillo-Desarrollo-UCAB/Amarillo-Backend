import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity({ name: "cupon" })
export class OrmCupon {

    @PrimaryColumn({ type: "uuid", name: "id_cupon" })
    id: string

    @Column({ type: "varchar", unique: true, name: "codigo" })
    code: string

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: 'timestamp' })
    fecha_expiracion: Date;

    @Column({ type: "numeric" })
    amount: number

    // TODO: Relacion con el usuario
    /*@Column({ type: 'uuid', nullable: true })
    id_user: string

    @ManyToOne(() => OrmUser, { nullable: true })
    @JoinColumn({ name: 'id_user' })
    user: OrmUser*/

    @ManyToMany(() => OrmUser, (user) => user.cupons)
    @JoinTable({
        name: "cupon_user",
        joinColumn: {
            name: "cupon_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })  // Tabla de unión
    users: OrmUser[];

    static create(
        id: string,
        code: string,
        fecha_creacion: Date,
        fecha_expiracion: Date,
        amount: number
    ) {
        const cupon = new OrmCupon()
        cupon.id = id
        cupon.code = code
        cupon.fecha_creacion = fecha_creacion
        cupon.fecha_expiracion = fecha_expiracion
        cupon.amount = amount
        return cupon
    }

    /*static createWithUser(
        id: string,
        code: string,
        fecha_creacion: Date,
        fecha_expiracion: Date,
        amount: number,
        id_user: string
    ) {
        const cupon = new OrmCupon()
        cupon.id = id
        cupon.code = code
        cupon.fecha_creacion = fecha_creacion
        cupon.fecha_expiracion = fecha_expiracion
        cupon.amount = amount
        cupon.id_user = id_user
        return cupon
    }*/

}