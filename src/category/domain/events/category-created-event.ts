import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class CategoryCreated extends DomainEvent{
    protected constructor ( 
        public id: string,
        public name: string,
        public icon: string)
    {
        super()
    }

    static create ( id: string, name: string, icon: string): CategoryCreated
    {
        return new CategoryCreated( id, name, icon)
    }
}