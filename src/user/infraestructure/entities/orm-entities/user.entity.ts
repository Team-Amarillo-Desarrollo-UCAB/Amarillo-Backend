import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { EnumUserRole } from "src/user/domain/user-role/user-role";
import { OrmOrder } from "src/order/infraestructure/entites/order.entity";
import { OrmCupon } from "src/cupon/infraestructure/entites/cupon.entity";

@Entity({ name: 'user' })
export class OrmUser {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('varchar')
    name: string

    @Column('varchar', { unique: true })
    email: string

    @Column('varchar', { nullable: true })
    password: string

    @Column('varchar', { unique: true, nullable: false })
    phone: string

    @Column('varchar', { nullable: true })
    image: string

    @Column('enum', { enum: EnumUserRole, default: 'CLIENT' })
    type: EnumUserRole

    @OneToMany(() => OrmOrder, (orden) => orden.user, { eager: true })
    ordenes: OrmOrder[];

    // TODO: Relaciones con las ordenes y carrito mas adelante
    /*@OneToMany(() => OrmCupon, (cupon) => cupon.user, {eager: true, nullable: true})
    cupones: OrmCupon[];*/

    @Column({ type: 'json', nullable: true })
    cupons: string[];

    static create(
        id: string,
        name: string,
        phone: string,
        email: string,
        image?: string,
        password?: string,
        type?: EnumUserRole,
        cupons?: string[],
    ): OrmUser {
        const user = new OrmUser()
        user.id = id
        user.email = email
        user.password = password
        user.phone = phone
        user.name = name
        user.image = image
        user.type = type
        user.cupons = cupons
        return user
    }

}