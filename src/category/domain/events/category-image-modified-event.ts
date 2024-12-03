import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class CategoryImageModified extends DomainEvent{
    protected constructor(
        public id:string,
        public image:string,
    ){
        super()
    }

    static create(id:string,image:string){
        return new CategoryImageModified(id,image)
    }
}