import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDiscountIdException extends DomainException{
    constructor(msg:string){super(msg); this.name = "InvalidDiscountIdException"}
}