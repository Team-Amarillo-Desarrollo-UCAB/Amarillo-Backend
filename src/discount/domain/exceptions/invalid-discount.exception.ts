import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDiscountException extends DomainException{
    constructor(msg:string){super(msg); 
        this.name = "InvalidDiscountException"
    }
    
}