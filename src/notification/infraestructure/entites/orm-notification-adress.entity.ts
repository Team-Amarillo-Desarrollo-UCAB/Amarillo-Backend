import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "notification-addres"})
export class OrmNotificationAdressEntity {

    @PrimaryColumn({ type: "varchar" })
    token: string

    @Column({ nullable: false })
    user_id: string;

    static create(
        token: string,
        user_id: string
    ){
        let entidad = new OrmNotificationAdressEntity()
        entidad.token = token
        entidad.user_id = user_id
        return entidad
    }

}

