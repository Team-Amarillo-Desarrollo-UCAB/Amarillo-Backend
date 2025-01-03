import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "notification-alert" })
export class OrmNotificationAlertEntity {

    @PrimaryColumn({ type: "varchar", unique: true })
    alert_id: string

    @Column({ nullable: false })
    user_id: string;

    @Column({ type: "varchar", nullable: false })
    title: string;

    @Column({ type: "varchar", nullable: false })
    body: string;

    @Column({ nullable: false })
    date: Date;

    @Column({ type: "boolean", nullable: false })
    user_readed: boolean;

    static create(
        alert_id: string,
        user_id: string,
        title: string,
        body: string,
        date: Date,
        user_readed: boolean
    ) {
        let entidad = new OrmNotificationAlertEntity()
        entidad.alert_id = alert_id
        entidad.user_id = user_id
        entidad.title = title
        entidad.body = body
        entidad.date = date
        return entidad
    }

}

