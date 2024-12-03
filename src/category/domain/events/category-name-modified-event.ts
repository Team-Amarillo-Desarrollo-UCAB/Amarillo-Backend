import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class CategoryNameModified extends DomainEvent{
    protected constructor(
        public id:string,
        public name:string,
    ){
        super()
    }

    static create(id:string,name:string){
        return new CategoryNameModified(id,name)
    }
}