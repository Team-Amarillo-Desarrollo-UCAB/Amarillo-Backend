import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDiscountDescriptionException extends DomainException{
    constructor(msg:string){super(msg); this.name = "InvalidDiscountDescriptionException"}
}