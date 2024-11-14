import { Column, Entity, PrimaryColumn } from "typeorm";

import { EnumUserRole } from "src/user/domain/user-role/user-role";

@Entity( { name: 'user' } )
export class OrmUser{

    @PrimaryColumn( { type: "uuid" } )
    id: string

    @Column( 'varchar' )
    name: string

    @Column( 'varchar', {unique: true} )
    email: string

    @Column( 'varchar', {nullable: true})
    password: string

    @Column( 'varchar', {unique: true, nullable:false}) 
    phone: string

    @Column( 'varchar', { nullable: true } )
    image: string

    @Column( 'enum', { enum: EnumUserRole, default: 'CLIENT' } )
    type: EnumUserRole

    // TODO: Relaciones con las ordenes y carrito mas adelante

    static create ( 
        id: string,
        name: string,
        phone: string,
        email: string,
        image?: string,
        password?: string,
        type?: EnumUserRole,
    ): OrmUser
    {
        const user = new OrmUser()
        user.id = id
        user.email = email
        user.password = password
        user.phone = phone
        user.name = name
        user.image = image
        user.type = type
        return user
    }

}