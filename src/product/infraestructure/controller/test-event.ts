import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class testCreated extends DomainEvent{
    protected constructor(
        public msg: string
    ) {
        super();
    }

    public static create(
        msg: string
    ): testCreated {
        return new testCreated(
            msg
        );
    }
}